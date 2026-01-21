import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Alert, AlertFilters, ApiResponse } from '@/types';

interface AlertState {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  filters: AlertFilters;
  stats: {
    pendingAlerts: number;
    criticalAlerts: number;
    totalAlerts: number;
  };
}

const initialState: AlertState = {
  alerts: [],
  loading: false,
  error: null,
  filters: {},
  stats: {
    pendingAlerts: 0,
    criticalAlerts: 0,
    totalAlerts: 0,
  },
};

// Async thunks
export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async (filters: AlertFilters = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<Alert[]>>('/api/alerts', {
        params: filters,
      });
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al cargar alertas'
      );
    }
  }
);

export const createAlert = createAsyncThunk(
  'alerts/createAlert',
  async (alertData: Partial<Alert>, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<Alert>>('/api/alerts', alertData);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al crear alerta'
      );
    }
  }
);

export const updateAlertStatus = createAsyncThunk(
  'alerts/updateStatus',
  async ({ id, status }: { id: string; status: 'REVIEWED' | 'RESOLVED' }, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<Alert>>(`/api/alerts/${id}/status`, {
        status,
      });
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al actualizar estado de alerta'
      );
    }
  }
);

export const deleteAlert = createAsyncThunk(
  'alerts/deleteAlert',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/alerts/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al eliminar alerta'
      );
    }
  }
);

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<AlertFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    updateStats: (state) => {
      state.stats.totalAlerts = state.alerts.length;
      state.stats.pendingAlerts = state.alerts.filter(
        alert => alert.status === 'PENDING'
      ).length;
      state.stats.criticalAlerts = state.alerts.filter(
        alert => alert.severity === 'CRITICAL' && alert.status === 'PENDING'
      ).length;
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
      alertSlice.caseReducers.updateStats(state);
    },
  },
  extraReducers: (builder) => {
    // Fetch alerts
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
        state.error = null;
        alertSlice.caseReducers.updateStats(state);
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create alert
    builder
      .addCase(createAlert.fulfilled, (state, action) => {
        state.alerts.unshift(action.payload);
        alertSlice.caseReducers.updateStats(state);
      });

    // Update alert status
    builder
      .addCase(updateAlertStatus.fulfilled, (state, action) => {
        const index = state.alerts.findIndex(alert => alert.id === action.payload.id);
        if (index !== -1) {
          state.alerts[index] = action.payload;
        }
        alertSlice.caseReducers.updateStats(state);
      });

    // Delete alert
    builder
      .addCase(deleteAlert.fulfilled, (state, action) => {
        state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
        alertSlice.caseReducers.updateStats(state);
      });
  },
});

export const { clearError, setFilters, clearFilters, addAlert } = alertSlice.actions;
export default alertSlice.reducer;