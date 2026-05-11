import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/projects');
    return res.data.projects;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch projects');
  }
});

export const fetchProject = createAsyncThunk('projects/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/projects/${id}`);
    return res.data.project;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch project');
  }
});

export const createProject = createAsyncThunk('projects/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/projects', data);
    return res.data.project;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create project');
  }
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/projects/${id}`, data);
    return res.data.project;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update project');
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete project');
  }
});

export const addMember = createAsyncThunk('projects/addMember', async ({ projectId, userId }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/projects/${projectId}/members`, { userId });
    return res.data.project;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add member');
  }
});

export const removeMember = createAsyncThunk('projects/removeMember', async ({ projectId, userId }, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${projectId}/members/${userId}`);
    return { projectId, userId };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove member');
  }
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    clearCurrent(state) { state.current = null; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchProjects.pending, pending)
      .addCase(fetchProjects.fulfilled, (state, a) => { state.loading = false; state.list = a.payload; })
      .addCase(fetchProjects.rejected, rejected)

      .addCase(fetchProject.pending, pending)
      .addCase(fetchProject.fulfilled, (state, a) => { state.loading = false; state.current = a.payload; })
      .addCase(fetchProject.rejected, rejected)

      .addCase(createProject.fulfilled, (state, a) => { state.list.unshift(a.payload); })

      .addCase(updateProject.fulfilled, (state, a) => {
        const idx = state.list.findIndex((p) => p._id === a.payload._id);
        if (idx >= 0) state.list[idx] = a.payload;
        if (state.current?._id === a.payload._id) state.current = a.payload;
      })

      .addCase(deleteProject.fulfilled, (state, a) => {
        state.list = state.list.filter((p) => p._id !== a.payload);
        if (state.current?._id === a.payload) state.current = null;
      })

      .addCase(addMember.fulfilled, (state, a) => {
        const idx = state.list.findIndex((p) => p._id === a.payload._id);
        if (idx >= 0) state.list[idx] = a.payload;
        if (state.current?._id === a.payload._id) state.current = a.payload;
      })

      .addCase(removeMember.fulfilled, (state, a) => {
        const { projectId, userId } = a.payload;
        const project = state.list.find((p) => p._id === projectId);
        if (project) project.members = project.members.filter((m) => m._id !== userId);
      });
  },
});

export const { clearCurrent, clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
