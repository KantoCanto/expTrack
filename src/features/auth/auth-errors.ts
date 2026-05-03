export function getAuthErrorMessage(error: unknown) {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (isRecord(error)) {
    if (typeof error.longMessage === 'string') {
      return error.longMessage;
    }

    if (typeof error.message === 'string') {
      return error.message;
    }

    if (Array.isArray(error.errors) && error.errors[0]) {
      return getAuthErrorMessage(error.errors[0]);
    }
  }

  return 'Unable to complete authentication. Check your Clerk settings and try again.';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object');
}
