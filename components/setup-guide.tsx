import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Database, Key, Server } from "lucide-react"

export function SetupGuide() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Required</h1>
          <p className="text-gray-600">Configure your Supabase connection to get started</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Step 1: Create Supabase Project
              </CardTitle>
              <CardDescription>Set up your database and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Go to supabase.com and create a new account</li>
                <li>Create a new project</li>
                <li>Wait for the project to be set up</li>
                <li>Go to Settings → API to find your credentials</li>
              </ol>
              <Button asChild className="w-full">
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                  Open Supabase <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Step 2: Configure Environment Variables
              </CardTitle>
              <CardDescription>Add your Supabase credentials to your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  Create a <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file in your project root:
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono">
                  <div>NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url</div>
                  <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key</div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Where to find these values:</strong>
                  <br />
                  In your Supabase dashboard, go to Settings → API
                  <br />• Project URL = URL
                  <br />• Anon key = anon/public key
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Step 3: Restart Development Server
              </CardTitle>
              <CardDescription>Apply the environment variables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">After adding the environment variables:</p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono">npm run dev</div>
                <p className="text-xs text-gray-600">
                  The page will automatically reload once the environment variables are detected.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-500">
          Need help? Check the{" "}
          <a
            href="https://supabase.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Supabase documentation
          </a>
        </div>
      </div>
    </div>
  )
}
