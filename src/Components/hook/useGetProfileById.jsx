import { useQuery } from "@apollo/client/react";
import { GET_PROFIEL_BY_ID } from "../../../graphql/queries";

const useGetProfileById = ({ _id }) => {

  const { data, loading, error, refetch } = useQuery(GET_PROFIEL_BY_ID, {
    variables: { id: _id },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    // skip: !_id,
  });

  return {
    profile: data?.getProfileById ?? null,
    loading,
    error,
    refetch,
  };
};

export default useGetProfileById;