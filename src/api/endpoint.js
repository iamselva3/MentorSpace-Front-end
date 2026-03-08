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


    const formData = new FormData();


    formData.append('title', articleData.title || '');
    formData.append('category', articleData.category || '');
    if (articleData.description) formData.append('description', articleData.description);
    if (articleData.coverImage) formData.append('coverImage', articleData.coverImage);

    const tagsToSend = articleData.tags || [];
    formData.append('tags', JSON.stringify(tagsToSend));

    const contentBlocks = articleData.contentBlocks || [];
    const contentBlocksWithoutFiles = [];
    const files = [];

    contentBlocks.forEach((block, index) => {
        if (!block) return;

        if (block.type === 'text') {
            contentBlocksWithoutFiles.push(block);
        } else {
            if (block.content && block.content instanceof File) {
                files.push({
                    file: block.content,
                    index: index,
                    type: block.type
                });

                contentBlocksWithoutFiles.push({
                    ...block,
                    content: ''
                });
            } else {
                contentBlocksWithoutFiles.push(block);
            }
        }
    });

    formData.append('contentBlocks', JSON.stringify(contentBlocksWithoutFiles));

    files.forEach(({ file, index, type }) => {
        const fieldName = type === 'image' ? 'images' :
            type === 'video' ? 'videos' : 'objects';

        formData.append(fieldName, file);
        formData.append(`index_${fieldName}_${index}`, index.toString());

        console.log(`📤 createArticle - Sending ${type} for block ${index}`);
    });

    return Api.post('/api/articles', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updateArticle = async (id, articleData) => {

    const hasFiles = articleData.contentBlocks?.some(
        block => block.content && block.content instanceof File
    );

    if (hasFiles) {
        const formData = new FormData();

        formData.append('title', articleData.title || '');
        formData.append('category', articleData.category || '');
        formData.append('description', articleData.description || '');
        formData.append('coverImage', articleData.coverImage || '');


        const tagsToSend = Array.isArray(articleData.tags) ? articleData.tags : [];

        formData.append('tags', JSON.stringify(tagsToSend));

        const contentBlocksWithoutFiles = [];
        const files = [];

        articleData.contentBlocks.forEach((block, index) => {

            if (block.type === 'text') {
                contentBlocksWithoutFiles.push(block);
            } else {
                if (block.content && block.content instanceof File) {
                    files.push({
                        file: block.content,
                        index: index,
                        type: block.type
                    });

                    contentBlocksWithoutFiles.push({
                        ...block,
                        content: ''
                    });
                } else {
                    contentBlocksWithoutFiles.push(block);
                }
            }
        });

        formData.append('contentBlocks', JSON.stringify(contentBlocksWithoutFiles));

        files.forEach(({ file, index, type }) => {
            const fieldName = type === 'image' ? 'images' :
                type === 'video' ? 'videos' : 'objects';

            formData.append(fieldName, file);
            formData.append(`index_${fieldName}_${index}`, index.toString());

        });


        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]);
        }

        return Api.patch(`/api/articles/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    } else {

        const jsonData = {
            title: articleData.title || '',
            category: articleData.category || '',
            description: articleData.description || '',
            coverImage: articleData.coverImage || '',
            tags: Array.isArray(articleData.tags) ? articleData.tags : [],
            contentBlocks: articleData.contentBlocks || []
        };



        return Api.patch(`/api/articles/${id}`, jsonData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
export const deleteArticle = async (articleId) => {
    const response = await Api.delete(`/api/articles/${articleId}`);
    return response.data;
};

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await Api.post('/api/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};


export const getTeacherAnalytics = async () => {
    const response = await Api.get("/api/analytics/teacher");
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
    const response = await Api.get(`/api/articles/${articleId}`);
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


export const trackTimeSpent = async (articleId, duration) => {
    const response = await Api.post("/api/tracking/time", { articleId, duration });
    return response.data;
};


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

export const askAI = async (data) => {
    const response = await Api.post('/api/ai/ask', data);
    return response.data;
};