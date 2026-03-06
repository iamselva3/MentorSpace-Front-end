import Api from "./Api";


export const register = async (userData) => {
    const response = await Api.post("/api/auth/register", userData);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await Api.get("/api/auth/verify-token");
    return response.data;
};


export const login = async (credentials) => {
    const response = await Api.post("/api/auth/login", credentials);
    return response.data;
};

export const getArticles = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await Api.get(`/api/articles?${queryParams}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }
};

export const getArticleById = async (articleId) => {
    const response = await Api.get(`/api/articles/${articleId}`);
    return response.data;
};
export const createArticle = async (articleData) => {
    const response = await Api.post("/api/articles", articleData);
    return response.data;
};

export const updateArticle = async (articleId, articleData) => {
    const response = await Api.put(`/api/articles/${articleId}`, articleData);
    return response.data;
};
export const deleteArticle = async (articleId) => {
    const response = await Api.delete(`/api/articles/${articleId}`);
    return response.data;
};

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await Api.post("/api/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};


export const getTeacherAnalytics = async () => {
    const response = await Api.get("/api/analytics/teacher");
    console.log(response.data);
    return response.data;
};

export const getStudentAnalytics = async () => {
    const response = await Api.get("/api/analytics/student");
    return response.data;
};


export const getRecentArticles = async () => {
    try {
        const response = await Api.get('/api/articles/recent-articles');
        return response.data;
    } catch (error) {
        console.error('Error fetching recent articles:', error);
        throw error;
    }
};

export const getArticleStats = async (articleId) => {
    const response = await Api.get(`/api/analytics/article/${articleId}`);
    return response.data;
};

export const getDailyEngagement = async (days = 7) => {
    const response = await Api.get(`/api/analytics/teacher?days=${days}`);
    return response.data;
};

export const getCategoryDistribution = async () => {
    const response = await Api.get("/api/analytics/categories");
    return response.data;
};


// export const trackArticleView = async (articleId) => {
//     const response = await Api.post("/api/tracking/view", { articleId });
//     return response.data;
// };


export const trackTimeSpent = async (articleId, duration) => {
    const response = await Api.post("/api/tracking/time", { articleId, duration });
    return response.data;
};


// export const startTrackingSession = async (articleId) => {
//     const response = await Api.post("/api/tracking/start", { articleId });
//     return response.data;
// };

// export const endTrackingSession = async (sessionId, duration) => {
//     const response = await Api.put(`/api/tracking/end/${sessionId}`, { duration });
//     return response.data;
// };


// In your endpoint.js


export const trackArticleView = async (articleId) => {
    try {
        const response = await Api.post(`/api/tracking/view/${articleId}`);
        return response.data;
    } catch (error) {
        console.error('Error tracking view:', error);
        throw error;
    }
};

export const trackReadingTime = async (articleId, duration) => {
    try {
        const response = await Api.post(`/api/tracking/duration/${articleId}`, { duration });
        return response.data;
    } catch (error) {
        console.error('Error tracking reading time:', error);
        throw error;
    }
};

// Note: Remove startTrackingSession and endTrackingSession if they don't exist


export const getArticleHighlights = async (articleId) => {
    const response = await Api.get(`/api/highlights/${articleId}`);
    return response.data;
};

export const getAllHighlights = async () => {
    const response = await Api.get("/api/highlights");
    return response.data;
};
export const createHighlight = async (highlightData) => {
    const response = await Api.post("/api/highlights", highlightData);
    return response.data;
};
export const updateHighlight = async (highlightId, highlightData) => {
    const response = await Api.patch(`/api/highlights/${highlightId}`, highlightData);
    return response.data;
};
export const deleteHighlight = async (highlightId) => {
    const response = await Api.delete(`/api/highlights/${highlightId}`);
    return response.data;
};


export const addHighlightNote = async (highlightId, note) => {
    const response = await Api.post(`/api/highlights/${highlightId}/note`, { note });
    return response.data;
};


export const getReadingProgress = async () => {
    const response = await Api.get("/api/progress");
    return response.data;
};


export const getReadArticles = async () => {
    const response = await Api.get("/api/student/read-articles");
    return response.data;
};


export const markArticleAsRead = async (articleId) => {
    const response = await Api.post("/api/student/mark-read", { articleId });
    return response.data;
};

export const getReadingTimeByCategory = async () => {
    const response = await Api.get("/api/analytics/reading-time");
    return response.data;
};


export const getTeacherArticles = async () => {
    const response = await Api.get("/api/articles");
    return response.data;
};

export const getStudentProgress = async (articleId) => {
    const response = await Api.get(`/api/analytics/student-progress/${articleId}`);
    return response.data;
};


export const getMostViewedCategories = async () => {
    const response = await Api.get("/api/analytics/top-categories");
    return response.data;
};

// Get total students count
export const getTotalStudents = async () => {
    const response = await Api.get("/api/analytics/total-students");
    return response.data;
};


export const getPresignedUrl = async (fileName, fileType) => {
    const response = await Api.post("/api/upload/presigned-url", { fileName, fileType });
    return response.data;
};

export const uploadToS3 = async (presignedUrl, file) => {
    const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type,
        },
    });
    return response;
};

export const deleteFile = async (fileKey) => {
    const response = await Api.delete(`/api/upload/${fileKey}`);
    return response.data;
};