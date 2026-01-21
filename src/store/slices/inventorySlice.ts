import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Equipment, InventoryFilters, ApiResponse } from '@/types';

interface InventoryState {
  equipment: Equipment[];
  loading: boolean;
  error: string | null;
  filters: InventoryFilters;
  stats: {
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
  };
}

const initialState: InventoryState = {
  equipment: [],
  loading: false,
  error: null,
  filters: {},
  stats: {
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
  },
};

// Async thunks
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (filters?: InventoryFilters, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<Equipment[]>>('/api/inventory', {
        params: filters,
      });
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al cargar inventario'
      );
    }
  }
);

export const createEquipment = createAsyncThunk(
  'inventory/createEquipment',
  async (equipmentData: Partial<Equipment>, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<Equipment>>('/api/inventory', equipmentData);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al crear equipo'
      );
    }
  }
);

export const updateEquipment = createAsyncThunk(
  'inventory/updateEquipment',
  async ({ id, data }: { id: string; data: Partial<Equipment> }, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<Equipment>>(`/api/inventory/${id}`, data);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al actualizar equipo'
      );
    }
  }
);

export const adjustQuantity = createAsyncThunk(
  'inventory/adjustQuantity',
  async ({ id, adjustment }: { id: string; adjustment: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<Equipment>>(`/api/inventory/${id}/adjust`, {
        adjustment,
      });
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al ajustar cantidad'
      );
    }
  }
);

export const deleteEquipment = createAsyncThunk(
  'inventory/deleteEquipment',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/inventory/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al eliminar equipo'
      );
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<InventoryFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    updateStats: (state) => {
      state.stats.totalItems = state.equipment.length;
      state.stats.lowStockItems = state.equipment.filter(
        item => item.currentQuantity <= item.minimumQuantity && item.currentQuantity > 0
      ).length;
      state.stats.outOfStockItems = state.equipment.filter(
        item => item.currentQuantity === 0
      ).length;
    },
  },
  extraReducers: (builder) => {
    // Fetch inventory
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.equipment = action.payload;
        state.error = null;
        // Update stats
        inventorySlice.caseReducers.updateStats(state);
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create equipment
    builder
      .addCase(createEquipment.fulfilled, (state, action) => {
        state.equipment.push(action.payload);
        inventorySlice.caseReducers.updateStats(state);
      });

    // Update equipment
    builder
      .addCase(updateEquipment.fulfilled, (state, action) => {
        const index = state.equipment.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.equipment[index] = action.payload;
        }
        inventorySlice.caseReducers.updateStats(state);
      });

    // Adjust quantity
    builder
      .addCase(adjustQuantity.fulfilled, (state, action) => {
        const index = state.equipment.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.equipment[index] = action.payload;
        }
        inventorySlice.caseReducers.updateStats(state);
      });

    // Delete equipment
    builder
      .addCase(deleteEquipment.fulfilled, (state, action) => {
        state.equipment = state.equipment.filter(item => item.id !== action.payload);
        inventorySlice.caseReducers.updateStats(state);
      });
  },
});

export const { clearError, setFilters, clearFilters } = inventorySlice.actions;
export default inventorySlice.reducer;