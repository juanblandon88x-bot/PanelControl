import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { GPSLocation, ApiResponse } from '@/types';

interface GPSState {
  locations: GPSLocation[];
  currentLocation: GPSLocation | null;
  loading: boolean;
  error: string | null;
  tracking: boolean;
  stats: {
    onlineEmployees: number;
    offlineEmployees: number;
    totalEmployees: number;
  };
}

const initialState: GPSState = {
  locations: [],
  currentLocation: null,
  loading: false,
  error: null,
  tracking: false,
  stats: {
    onlineEmployees: 0,
    offlineEmployees: 0,
    totalEmployees: 0,
  },
};

// Async thunks
export const fetchGPSLocations = createAsyncThunk(
  'gps/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<GPSLocation[]>>('/api/gps/locations');
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al cargar ubicaciones GPS'
      );
    }
  }
);

export const updateGPSLocation = createAsyncThunk(
  'gps/updateLocation',
  async (locationData: {
    latitude: number;
    longitude: number;
    accuracy: number;
    batteryLevel: number;
    speed: number;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<GPSLocation>>('/api/gps/update', locationData);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al actualizar ubicación GPS'
      );
    }
  }
);

export const toggleGPSTracking = createAsyncThunk(
  'gps/toggleTracking',
  async (enabled: boolean, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<{ enabled: boolean }>>('/api/gps/toggle', {
        enabled,
      });
      return response.data.data!.enabled;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al cambiar estado del GPS'
      );
    }
  }
);

export const sendAlert = createAsyncThunk(
  'gps/sendAlert',
  async ({ userId, message, urgent }: { userId: string; message: string; urgent: boolean }, { rejectWithValue }) => {
    try {
      await axios.post('/api/gps/alert', {
        userId,
        message,
        urgent,
      });
      return { userId, message, urgent };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al enviar alerta'
      );
    }
  }
);

const gpsSlice = createSlice({
  name: 'gps',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTracking: (state, action: PayloadAction<boolean>) => {
      state.tracking = action.payload;
    },
    updateStats: (state) => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      state.stats.totalEmployees = state.locations.length;
      state.stats.onlineEmployees = state.locations.filter(
        location => new Date(location.timestamp) > fiveMinutesAgo && location.isActive
      ).length;
      state.stats.offlineEmployees = state.stats.totalEmployees - state.stats.onlineEmployees;
    },
    addLocation: (state, action: PayloadAction<GPSLocation>) => {
      const existingIndex = state.locations.findIndex(
        location => location.userId === action.payload.userId
      );
      
      if (existingIndex !== -1) {
        state.locations[existingIndex] = action.payload;
      } else {
        state.locations.push(action.payload);
      }
      
      gpsSlice.caseReducers.updateStats(state);
    },
  },
  extraReducers: (builder) => {
    // Fetch GPS locations
    builder
      .addCase(fetchGPSLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGPSLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
        state.error = null;
        gpsSlice.caseReducers.updateStats(state);
      })
      .addCase(fetchGPSLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update GPS location
    builder
      .addCase(updateGPSLocation.fulfilled, (state, action) => {
        state.currentLocation = action.payload;
        gpsSlice.caseReducers.addLocation(state, action);
      });

    // Toggle GPS tracking
    builder
      .addCase(toggleGPSTracking.fulfilled, (state, action) => {
        state.tracking = action.payload;
      });

    // Send alert
    builder
      .addCase(sendAlert.fulfilled, (state) => {
        // Alert sent successfully
      });
  },
});

export const { clearError, setTracking, addLocation } = gpsSlice.actions;
export default gpsSlice.reducer;