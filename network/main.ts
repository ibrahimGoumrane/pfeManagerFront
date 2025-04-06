import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
  LockedError,
} from "@/errors/main";
import { serverAddress } from "@/config/main";

export async function fetchData<T>(input: RequestInfo, init?: RequestInit) {
  if (!init) init = {};

  if (!init.headers) {
    init.headers = {};
  }

  // Set default headers
  init.headers = {
    ...init.headers,
    Accept: "application/json",
  };

  // Only set Content-Type to application/json if the body is not FormData
  if (!(init.body instanceof FormData)) {
    init.headers = {
      ...init.headers,
      "Content-Type": "application/json",
    };
  }

  init.credentials = "include";

  const token = localStorage.getItem("authToken");
  if (token) {
    init.headers = {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(serverAddress + input, init);

    if (response.status === 204 && init.method === "DELETE") {
      return true;
    }

    if (response.ok) {
      return response.json() as Promise<T>;
    } else {
      const errorBody = await response.json();
      const errorMessage = errorBody.message;
      switch (response.status) {
        case 401:
          throw new UnauthorizedError(errorMessage);
        case 409:
          throw new ConflictError(errorMessage);
        case 400:
          throw new BadRequestError(errorMessage);
        case 403:
          throw new ForbiddenError(errorMessage);
        case 404:
          throw new NotFoundError(errorMessage);
        case 423:
          throw new LockedError(errorMessage);
        case 500:
          throw new InternalServerError(errorMessage);
        default:
          throw new Error(
            `Request failed with status: ${response.status} message: ${errorMessage}`
          );
      }
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
