import { Metadata } from "next"

import { Hydrate, dehydrate } from "@tanstack/react-query"

import { SearchInput } from "~/components/common/SearchInput"
import { HomeFeed } from "~/components/home/HomeFeed"
import { APP_NAME } from "~/lib/env"
import getQueryClient from "~/lib/query-client"
import { prefetchGetFeed } from "~/queries/home.server"

export function generateMetadata({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}): Metadata {
  return {
    title: `Search: ${searchParams.q} - ${APP_NAME}`,
  }
}

async function Search({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | undefined
  }
}) {
  const queryClient = getQueryClient()
  await prefetchGetFeed(
    {
      type: "search",
      searchKeyword: searchParams.q || undefined,
      searchType: "latest",
    },
    queryClient,
  )

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <SearchInput />
      <div className="mt-10">
        <HomeFeed type="search" />
      </div>
    </Hydrate>
  )
}

export default Search
