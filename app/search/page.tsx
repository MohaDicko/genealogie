import { Suspense } from "react"
import { Header } from "@/components/header"
import { SearchContent } from "@/components/search-content"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"

function SearchLoading() {
  return (
    <Card className="max-w-lg mx-auto">
      <CardContent className="p-10 text-center">
        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground">Chargement...</p>
      </CardContent>
    </Card>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<SearchLoading />}>
          <SearchContent />
        </Suspense>
      </main>
    </div>
  )
}
