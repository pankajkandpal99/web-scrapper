import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthService } from "../../services/auth.service";
import { LoginFormValues, RegisterFormValues } from "../../schema/authSchema";

import { clearUser, setUser } from "../user/user.slice";
import {
  handleAuthentication,
  logout,
  verifyTokenClientSide,
} from "../../utils/authUtils";

interface AuthState {
  loading: boolean;
  error: string | null;
  registered: boolean;
  authenticated: boolean;
  initialized: boolean;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  registered: false,
  authenticated: false,
  initialized: false, // Will be true after first auth check
};

export const verifyAuth = createAsyncThunk<{ authenticated: boolean }>(
  "auth/verify",
  async () => {
    const authenticated = verifyTokenClientSide();
    return { authenticated };
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterFormValues, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(userData);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (loginData: LoginFormValues, { rejectWithValue, dispatch }) => {
    try {
      const response = await AuthService.login(loginData);
      handleAuthentication(response);

      dispatch(setUser(response.user));
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      logout();
      dispatch(clearUser());

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetRegistration: (state) => {
      state.registered = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registered = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registered = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.registered = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.authenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.authenticated = action.payload.authenticated;
        state.initialized = true;
        state.error = null;
      })
      .addCase(verifyAuth.rejected, (state) => {
        state.loading = false;
        state.authenticated = false;
        state.initialized = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.authenticated = false;
        state.error = null;
      });
  },
});

export const { resetRegistration, clearError } = authSlice.actions;
export default authSlice.reducer;

// --------------------------------------------
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { AuthService } from "../../services/auth.service";
// import { LoginFormValues, RegisterFormValues } from "../../schema/authSchema";
// import { verifyTokenClientSide } from "../../utils/authUtils";
// import { setUser } from "../user/user.slice";

// interface AuthState {
//   loading: boolean;
//   error: string | null;
//   registered: boolean;
//   authenticated: boolean;
//   initialized: boolean;
// }

// const initialState: AuthState = {
//   loading: false,
//   error: null,
//   registered: false,
//   authenticated: false,
//   initialized: false, // Will be true after first auth check
// };

// export const verifyAuth = createAsyncThunk<{ authenticated: boolean }>(
//   "auth/verify",
//   async () => {
//     return { authenticated: verifyTokenClientSide() };
//   }
// );

// export const registerUser = createAsyncThunk(
//   "auth/register",
//   async (userData: RegisterFormValues, { rejectWithValue }) => {
//     try {
//       const response = await AuthService.register(userData);
//       return response;
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue("Registration failed");
//     }
//   }
// );

// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (loginData: LoginFormValues, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await AuthService.login(loginData);
//       dispatch(setUser(response.data.user));
//       return response;
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue("Registration failed");
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     resetRegistration: (state) => {
//       state.registered = false;
//       state.error = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.registered = false;
//       })
//       .addCase(registerUser.fulfilled, (state) => {
//         state.loading = false;
//         state.registered = true;
//         state.error = null;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//         state.registered = false;
//       })
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state) => {
//         state.loading = false;
//         state.authenticated = true;
//         state.error = null;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(verifyAuth.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(verifyAuth.fulfilled, (state, action) => {
//         state.loading = false;
//         state.authenticated = action.payload.authenticated;
//         state.initialized = true;
//       })
//       .addCase(verifyAuth.rejected, (state) => {
//         state.loading = false;
//         state.authenticated = false;
//         state.initialized = true;
//       });
//   },
// });

// export const { resetRegistration, clearError } = authSlice.actions;
// export default authSlice.reducer;
