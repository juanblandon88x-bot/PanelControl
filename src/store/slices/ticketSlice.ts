import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Ticket, TicketFilters, ApiResponse, PaginatedResponse } from '@/types';

interface TicketState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  loading: boolean;
  error: string | null;
  filters: TicketFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: TicketState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (params: { page?: number; limit?: number; filters?: TicketFilters }, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponse<Ticket>>>('/api/tickets', {
        params: { ...params.filters, page: params.page, limit: params.limit },
      });
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al cargar tickets'
      );
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'tickets/fetchTicketById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<Ticket>>(`/api/tickets/${id}`);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al cargar ticket'
      );
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData: Partial<Ticket>, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<Ticket>>('/api/tickets', ticketData);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al crear ticket'
      );
    }
  }
);

export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async ({ id, data }: { id: string; data: Partial<Ticket> }, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<Ticket>>(`/api/tickets/${id}`, data);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al actualizar ticket'
      );
    }
  }
);

export const takeTicket = createAsyncThunk(
  'tickets/takeTicket',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<Ticket>>(`/api/tickets/${id}/take`);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al tomar ticket'
      );
    }
  }
);

export const resolveTicket = createAsyncThunk(
  'tickets/resolveTicket',
  async ({ id, resolutionData }: { id: string; resolutionData: { notes: string; photos: string[] } }, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<Ticket>>(`/api/tickets/${id}/resolve`, resolutionData);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al resolver ticket'
      );
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<TicketFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.currentTicket = action.payload;
    },
    setPagination: (state, action: PayloadAction<{ page?: number; limit?: number }>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Fetch tickets
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
        state.error = null;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch ticket by ID
    builder
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.currentTicket = action.payload;
      });

    // Create ticket
    builder
      .addCase(createTicket.fulfilled, (state, action) => {
        state.tickets.unshift(action.payload);
        state.pagination.total += 1;
      });

    // Update ticket
    builder
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
        if (state.currentTicket?.id === action.payload.id) {
          state.currentTicket = action.payload;
        }
      });

    // Take ticket
    builder
      .addCase(takeTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
        if (state.currentTicket?.id === action.payload.id) {
          state.currentTicket = action.payload;
        }
      });

    // Resolve ticket
    builder
      .addCase(resolveTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
        if (state.currentTicket?.id === action.payload.id) {
          state.currentTicket = action.payload;
        }
      });
  },
});

export const { clearError, setFilters, clearFilters, setCurrentTicket, setPagination } = ticketSlice.actions;
export default ticketSlice.reducer;