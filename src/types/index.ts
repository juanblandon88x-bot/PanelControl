// User Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'OWNER' | 'ADMINISTRATOR' | 'EMPLOYEE';
  branchId?: string;
  isActive: boolean;
  lastAccess?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Database User type (matches database schema)
export interface UserDB {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'OWNER' | 'ADMINISTRATOR' | 'EMPLOYEE';
  branch_id?: string;
  is_active: boolean;
  last_access?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Ticket Types
export interface Ticket {
  id: string;
  ticketNumber: string;
  customerName: string;
  address: string;
  houseReference?: string;
  customerId: string;
  customerTag: string;
  problemType: ProblemType;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED';
  assignedTo?: string;
  assignedToName?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  resolvedAt?: Date;
  resolutionNotes?: string;
  resolutionPhotos: string[];
}

export enum ProblemType {
  INTERNET_RECONNECTION = 'Internet Reconnection',
  TV_RECONNECTION = 'TV Reconnection',
  SERVICE_CUT = 'Service Cut',
  TV_MAINTENANCE = 'TV Maintenance',
  INTERNET_MAINTENANCE = 'Internet Maintenance',
  NEW_INSTALLATION = 'New Installation',
  EQUIPMENT_DAMAGE = 'Equipment Damage',
  TECHNICAL_SUPPORT = 'Technical Support'
}

// Equipment Types
export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  serialNumber?: string;
  currentQuantity: number;
  minimumQuantity: number;
  unit: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum EquipmentType {
  ROUTER = 'Router',
  MODEM = 'Modem',
  CABLE = 'Cable',
  ANTENNA = 'Antenna',
  SWITCH = 'Switch',
  CONNECTOR = 'Connector',
  SPLITTER = 'Splitter',
  AMPLIFIER = 'Amplifier',
  OTHER = 'Other'
}

export interface InventoryStatus {
  status: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  indicator: '🟢' | '🟡' | '🔴';
}

// GPS Types
export interface GPSLocation {
  id: string;
  userId: string;
  userName?: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  batteryLevel: number;
  speed: number;
  timestamp: Date;
  isActive: boolean;
}

export interface GPSStatus {
  status: 'ONLINE' | 'OFFLINE';
  indicator: '🟢' | '🔴';
  lastUpdate: Date;
}

// Alert Types
export interface Alert {
  id: string;
  type: AlertType;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  message: string;
  entityId?: string;
  entityType?: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  createdAt: Date;
  reviewedAt?: Date;
  resolvedAt?: Date;
  reviewedBy?: string;
}

export enum AlertType {
  GPS_DISABLED = 'GPS_DISABLED',
  LOW_STOCK = 'LOW_STOCK',
  URGENT_TICKET = 'URGENT_TICKET',
  OVERDUE_TICKET = 'OVERDUE_TICKET',
  TECHNICIAN_INACTIVE = 'TECHNICIAN_INACTIVE',
  CRITICAL = 'CRITICAL'
}

// Dashboard Types
export interface DashboardMetrics {
  totalPendingTickets: number;
  ticketsInProgress: number;
  ticketsResolvedToday: number;
  activeAlerts: number;
  ticketTrend: TrendData[];
  technicianPerformance: PerformanceData[];
  recentAlerts: Alert[];
}

export interface TrendData {
  date: string;
  created: number;
  resolved: number;
}

export interface PerformanceData {
  technicianId: string;
  name: string;
  resolvedTickets: number;
  averageResolutionTime: number;
  rating: number;
}

// Branch Types
export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Audit Types
export interface AuditLog {
  id: string;
  userId: string;
  userName?: string;
  actionType: string;
  entityType: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  timestamp: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter Types
export interface TicketFilters {
  search?: string;
  status?: string;
  priority?: string;
  problemType?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface InventoryFilters {
  search?: string;
  type?: string;
  status?: string;
}

export interface AlertFilters {
  status?: string;
  severity?: string;
  type?: string;
}