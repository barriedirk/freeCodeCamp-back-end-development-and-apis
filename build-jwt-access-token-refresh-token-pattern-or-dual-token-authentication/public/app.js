const accessTokenInput = document.querySelector('#access-token');
const refreshTokenInput = document.querySelector('#refresh-token');
const responseOutput = document.querySelector('#response-output');
const responseStatus = document.querySelector('#response-status');

function redactTokens(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return data;
  }

  const safeData = { ...data };
  for (const key of ['token', 'accessToken', 'refreshToken']) {
    if (typeof safeData[key] === 'string') {
      safeData[key] = '[saved in session fields]';
    }
  }
  return safeData;
}

function showResponse(status, data) {
  responseStatus.textContent = status;
  responseOutput.textContent = JSON.stringify(redactTokens(data), null, 2);
}

async function requestApi(path, { method = 'GET', body, accessToken } = {}) {
  const headers = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    data = responseText;
  }

  return { response, data };
}

async function callApi(path, options = {}, saveTokens = false) {
  responseStatus.textContent = 'Requesting…';
  responseOutput.textContent = `${options.method || 'GET'} ${path}`;

  try {
    const { response, data } = await requestApi(path, options);
    if (saveTokens && response.ok && data && typeof data === 'object') {
      const accessToken = data.accessToken || data.token;
      if (typeof accessToken === 'string') {
        accessTokenInput.value = accessToken;
      }
      if (typeof data.refreshToken === 'string') {
        refreshTokenInput.value = data.refreshToken;
      }
    }

    showResponse(`${response.status} ${response.statusText}`, data);
    return response.ok;
  } catch (error) {
    showResponse('Request failed', { error: error.message });
    return false;
  }
}

document.querySelector('#health-button').addEventListener('click', () => {
  callApi('/');
});

document.querySelector('#credentials-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const action = event.submitter?.dataset.action;
  const formData = new FormData(event.currentTarget);
  const path = action === 'register' ? '/api/auth/register' : '/api/auth/login';

  callApi(path, {
    method: 'POST',
    body: {
      email: formData.get('email'),
      password: formData.get('password')
    }
  }, true);
});

document.querySelector('#profile-button').addEventListener('click', () => {
  callApi('/api/auth/profile', {
    accessToken: accessTokenInput.value.trim()
  });
});

document.querySelector('#refresh-button').addEventListener('click', () => {
  callApi('/api/auth/refresh', {
    method: 'POST',
    body: { refreshToken: refreshTokenInput.value.trim() }
  }, true);
});

document.querySelector('#logout-button').addEventListener('click', async () => {
  const loggedOut = await callApi('/api/auth/logout', {
    method: 'POST',
    accessToken: accessTokenInput.value.trim()
  });

  if (loggedOut) {
    accessTokenInput.value = '';
    refreshTokenInput.value = '';
  }
});

document.querySelector('#users-button').addEventListener('click', () => {
  callApi('/api/admin/users', {
    accessToken: accessTokenInput.value.trim()
  });
});
