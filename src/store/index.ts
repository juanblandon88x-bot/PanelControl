import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import dashboardSlice from './slices/dashboardSlice';
import ticketSlice from './slices/ticketSlice';
import inventorySlice from './slices/inventorySlice';
import gpsSlice from './slices/gpsSlice';
import alertSlice from './slices/alertSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    dashboard: dashboardSlice,
    tickets: ticketSlice,
    inventory: inventorySlice,
    gps: gpsSlice,
    alerts: alertSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;