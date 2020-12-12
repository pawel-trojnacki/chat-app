import '@testing-library/jest-dom/extend-expect';
import { act, renderHook } from '@testing-library/react-hooks';
import { cleanup } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useAxios } from '../hooks/useAxios';

enum Indexes {
  Error,
  IsLoading,
  SendRequest,
}

const server = setupServer(
  rest.get('/api', (req, res, ctx) => {
    return res(ctx.status(200));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
afterEach(cleanup);

describe('useAxios', () => {
  test('does not return error when route is correct', async () => {
    const { result } = renderHook(useAxios);
    await act(() => result.current[Indexes.SendRequest]('/api/'));
    expect(result.current[Indexes.Error]).toBeNull();
  });

  test('returns error when route is incorrect', async () => {
    const { result } = renderHook(useAxios);
    await act(() => result.current[Indexes.SendRequest]('/unexisting'));
    expect(result.current[Indexes.Error]).toBeTruthy();
  });
});
