import axios from "axios";

// ─────────────────────────────────────────────────────────────
// Base URL
// ─────────────────────────────────────────────────────────────
const baseURL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://final-shopsphere-2-jeoy.onrender.com";

// ─────────────────────────────────────────────────────────────
// Token helper
// ─────────────────────────────────────────────────────────────
const getAdminToken = () =>
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("authToken") ||
    "";

// ─────────────────────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────────────────────
const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ─────────────────────────────────────────────────────────────
// Request interceptor (JWT)
// ─────────────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAdminToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────────
// Response interceptor (Auth handling)
// ─────────────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const currentPath = window.location.pathname;

        if ((status === 401 || status === 403) && currentPath !== "/login") {
            logout();
        }
        return Promise.reject(error);
    }
);

export { axiosInstance };

// ─────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────
export const adminLogin = async (username, password) => {
    const response = await axiosInstance.post(
        "/superAdmin/api/admin-login/",
        { username, password }
    );

    if (response.data?.access) {
        const { access, refresh } = response.data;
        localStorage.setItem("accessToken", access);
        localStorage.setItem("authToken", access);
        if (refresh) localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminUsername", username);
    }

    return response.data;
};

export const logout = () => {
    [
        "accessToken",
        "authToken",
        "refreshToken",
        "adminAuthenticated",
        "adminUsername",
    ].forEach((k) => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
    });

    window.location.href = "/login";
};

// ─────────────────────────────────────────────────────────────
// Admin / Dashboard
// ─────────────────────────────────────────────────────────────
export const whoAmI = () =>
    axiosInstance.get("/superAdmin/api/whoami/").then((r) => r.data);

export const fetchDashboardStats = () =>
    axiosInstance.get("/superAdmin/api/dashboard/").then((r) => r.data);

// ─────────────────────────────────────────────────────────────
// Vendors
// ─────────────────────────────────────────────────────────────
export const fetchVendorRequests = () =>
    axiosInstance.get("/superAdmin/api/vendor-requests/").then((r) => r.data);

export const fetchAllVendors = () =>
    axiosInstance.get("/superAdmin/api/vendors/").then((r) => r.data);

export const fetchVendorDetail = (id) =>
    axiosInstance.get(`/superAdmin/api/vendors/${id}/`).then((r) => r.data);

export const approveVendorRequest = (id, reason = "") =>
    axiosInstance
        .post(`/superAdmin/api/vendor-requests/${id}/approve/`, { reason })
        .then((r) => r.data);

export const rejectVendorRequest = (id, reason) =>
    axiosInstance
        .post(`/superAdmin/api/vendor-requests/${id}/reject/`, { reason })
        .then((r) => r.data);

export const blockVendor = (id, reason) =>
    axiosInstance
        .post(`/superAdmin/api/vendors/${id}/block/`, { reason })
        .then((r) => r.data);

export const unblockVendor = (id, reason = "") =>
    axiosInstance
        .post(`/superAdmin/api/vendors/${id}/unblock/`, { reason })
        .then((r) => r.data);

// ─────────────────────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────────────────────
export const fetchAllProducts = (params = {}) =>
    axiosInstance
        .get("/superAdmin/api/products/", { params })
        .then((r) => r.data);

export const fetchProductsByVendor = (vendorId) =>
    axiosInstance.get(`/superAdmin/api/products/?vendor_id=${vendorId}`).then((r) => r.data);

// ─────────────────────────────────────────────────────────────
// Delivery Agents
// ─────────────────────────────────────────────────────────────
export const fetchDeliveryRequests = () =>
    axiosInstance.get('/superAdmin/api/delivery-requests/').then((r) => r.data);

export const fetchAllDeliveryAgents = () =>
    axiosInstance.get('/superAdmin/api/delivery-agents/').then((r) => r.data);

export const fetchDeliveryAgentDetail = (id) =>
    axiosInstance.get(`/superAdmin/api/delivery-agents/${id}/`).then((r) => r.data);

export const approveDeliveryAgent = (id, reason = '') =>
    axiosInstance.post(`/superAdmin/api/delivery-requests/${id}/approve/`, { reason }).then((r) => r.data);

export const rejectDeliveryAgent = (id, reason) =>
    axiosInstance.post(`/superAdmin/api/delivery-requests/${id}/reject/`, { reason }).then((r) => r.data);

export const blockDeliveryAgent = (id, reason) =>
    axiosInstance.post(`/superAdmin/api/delivery-agents/${id}/block/`, { reason }).then((r) => r.data);

export const unblockDeliveryAgent = (id) =>
    axiosInstance.post(`/superAdmin/api/delivery-agents/${id}/unblock/`, {}).then((r) => r.data);

// ─────────────────────────────────────────────────────────────
// Commission Settings
// ─────────────────────────────────────────────────────────────
export const fetchGlobalCommission = () =>
    axiosInstance.get('/superAdmin/api/commission-settings/global/').then((r) => r.data);

export const updateGlobalCommission = (data) =>
    axiosInstance.post('/superAdmin/api/commission-settings/global/', data).then((r) => r.data);

export const fetchCategoryCommissions = () =>
    axiosInstance.get('/superAdmin/api/commission-settings/').then((r) => r.data);

export const saveCategoryCommission = (data) =>
    axiosInstance.post('/superAdmin/api/commission-settings/', data).then((r) => r.data);

export const updateCategoryCommission = (id, data) =>
    axiosInstance.patch(`/superAdmin/api/commission-settings/${id}/`, data).then((r) => r.data);

export const deleteCategoryCommission = (id) =>
    axiosInstance.delete(`/superAdmin/api/commission-settings/${id}/`).then((r) => r.data);

// ─────────────────────────────────────────────────────────────
// Reports
// ─────────────────────────────────────────────────────────────
export const fetchReports = () =>
    axiosInstance.get('/superAdmin/api/reports/').then((r) => r.data);

// ─────────────────────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────────────────────
export const fetchUsers = (params = {}) =>
    axiosInstance.get('/superAdmin/api/users/', { params }).then((r) => r.data);

export const toggleUserBlock = (userId, action, reason = '') =>
    axiosInstance.post(`/superAdmin/api/users/${userId}/toggle-block/`, { action, reason }).then((r) => r.data);

// ─────────────────────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────────────────────
export const fetchAdminOrders = (params = {}) =>
    axiosInstance
        .get("/superAdmin/api/orders/", { params })
        .then((r) => r.data);

export const fetchAdminOrderDetail = (id) =>
    axiosInstance.get(`/superAdmin/api/orders/${id}/`).then((r) => r.data);

export const triggerAssignment = (orderId) =>
    axiosInstance.post(`/superAdmin/api/trigger-assignment/${orderId}/`, {}).then((r) => r.data);

// ─────────────────────────────────────────────────────────────
// Delivery Simulation (Agent Actions)
// ─────────────────────────────────────────────────────────────
export const updateDeliveryStatus = (assignmentId, status, notes = "") =>
    axiosInstance.post(`/api/delivery/assignments/${assignmentId}/update-status/`, {
        status,
        notes
    }).then((r) => r.data);

export const completeDeliveryOTP = (assignmentId, otpCode) =>
    axiosInstance.post(`/api/delivery/assignments/${assignmentId}/complete/`, {
        otp_code: otpCode
    }).then((r) => r.data);

// ─────────────────────────────────────────────────────────────
// Returns
// ─────────────────────────────────────────────────────────────
export const fetchAdminReturns = (params = {}) =>
    axiosInstance
        .get("/superAdmin/api/order-returns/", { params })
        .then((r) => r.data);

export const approveReturn = (id) =>
    axiosInstance
        .post(`/superAdmin/api/order-returns/${id}/approve/`)
        .then((r) => r.data);

export const fetchReturnDetail = (id) =>
    axiosInstance.get(`/superAdmin/api/order-returns/${id}/`).then((r) => r.data);

export const rejectReturn = (id, reason) =>
    axiosInstance
        .post(`/superAdmin/api/order-returns/${id}/reject/`, { reason })
        .then((r) => r.data);

export const processRefund = (id) =>
    axiosInstance
        .post(`/superAdmin/api/order-returns/${id}/process_refund/`)
        .then((r) => r.data);