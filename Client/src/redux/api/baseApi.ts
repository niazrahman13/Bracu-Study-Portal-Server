// src/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { logout, setUser } from '../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api/v1',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await fetch('http://localhost:3000/api/v1/auth/refresh-token', {
      method: 'POST',
      credentials: 'include',
    });

    const refreshData = await refreshResult.json();

    if (refreshData.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;
      api.dispatch(setUser({ token: refreshData.data.accessToken, user }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken,
  endpoints: (builder) => ({
    // Fetch comments for a specific review
    getCommentsByReview: builder.query({
      query: (reviewId) => `/reviews/${reviewId}/comments`,
    }),
    // Add a new comment to a review
    addComment: builder.mutation({
      query: ({ reviewId, commentData }) => ({
        url: `/reviews/${reviewId}/comments`,
        method: 'POST',
        body: commentData,
      }),
    }),
    // Update a comment
    updateComment: builder.mutation({
      query: ({ commentId, updatedContent }) => ({
        url: `/comments/${commentId}`,
        method: 'PUT',
        body: updatedContent,
      }),
    }),
    // Delete a comment
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCommentsByReviewQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = baseApi;
