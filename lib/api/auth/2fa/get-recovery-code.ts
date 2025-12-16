import { axiosInstance } from "@/lib/axios";
import { queryClient, QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

interface GetRecoveryCodesResponse {
  status: boolean;
  code: string;
  message: string;
  data: string[] | null;
  errors: null;
}

const getRecoveryCodes = async () => {
  const response = await axiosInstance.get<GetRecoveryCodesResponse>(
    "/api/auth/two-factor/recovery-code"
  );
  if (!response.data.status) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const QUERY_KEY = ["recovery-codes"];

const getRecoveryCodesQueryOptions = () => {
  return queryOptions({
    queryKey: QUERY_KEY,
    queryFn: getRecoveryCodes,
  });
};

type UseGetRecoveryCodesParams = {
  queryConfig?: QueryConfig<typeof getRecoveryCodesQueryOptions>;
};

export function useGetRecoveryCodes({
  queryConfig,
}: UseGetRecoveryCodesParams = {}) {
  const recoveryCodesQuery = useQuery({
    ...getRecoveryCodesQueryOptions(),
    ...queryConfig,
  });
  return recoveryCodesQuery;
}

export function invalidateRecoveryCodes() {
  return queryClient.invalidateQueries({
    queryKey: QUERY_KEY,
  });
}
