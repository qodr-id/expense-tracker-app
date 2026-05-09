import React from "react";

export function QueryMessage({ query, pendingText }) {
  if (query.isPending || query.isLoading) return <p className="message">{pendingText}</p>;
  if (query.isError) return <p className="message error">{query.error.message}</p>;
  return null;
}
