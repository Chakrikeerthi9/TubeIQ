import Link from 'next/link';
import { Bot, Play, BarChart3, Brain, Zap, Users, TrendingUp, Shield, Cloud, Database, MessageSquare, Lock, Server, Globe, CheckCircle } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">TubeIQ</span>
          </div>
          <nav className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
            </div>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/main" className="hidden md:block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Dashboard
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            AI-Powered
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Video Understanding</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your YouTube content with intelligent summarization, semantic search, and AI-driven Q&A to understand and interact with any video content.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <SignedIn>
              <Link href="/main" className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg">
                <Play className="w-5 h-5" />
                Start Understanding
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg">
                  <Play className="w-5 h-5" />
                  Sign In to Get Started
                </button>
              </SignInButton>
            </SignedOut>
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:border-gray-400 transition-colors">
              Watch Demo
            </button>
          </div>

          {/* Core Features */}
          <div id="features" className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Video Summarization</h3>
              <p className="text-gray-600">Advanced AI extracts key insights from any YouTube video, generating comprehensive summaries and understanding the content automatically.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Semantic Search & Q&A</h3>
              <p className="text-gray-600">Ask questions about video content using natural language. Our RAG system provides intelligent, context-aware answers about any video.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Intelligent Content Understanding</h3>
              <p className="text-gray-600">Understand complex video content through AI-powered analysis, semantic search, and intelligent question-answering capabilities.</p>
            </div>
          </div>

          {/* Technical Features */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Enterprise-Grade Infrastructure</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Clerk Authentication</h3>
                <p className="text-sm text-gray-600">Secure user management with enterprise-grade authentication and authorization.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Cloud className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AWS Hosting</h3>
                <p className="text-sm text-gray-600">Scalable cloud infrastructure with 99.9% uptime and global CDN distribution.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Lock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Rate Limiting</h3>
                <p className="text-sm text-gray-600">Intelligent rate limiting protects against abuse while ensuring optimal performance.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Database className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Vector Database</h3>
                <p className="text-sm text-gray-600">Advanced vector storage for semantic search and context-aware AI responses.</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-20">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-600">Videos Summarized</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">50M+</div>
                <div className="text-gray-600">Questions Answered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">99%</div>
                <div className="text-gray-600">Understanding Accuracy</div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">How TubeIQ Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Sign In & Paste URL</h3>
                <p className="text-gray-600">Sign in to access the platform, then paste any YouTube video URL to begin analysis.</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Summarization</h3>
                <p className="text-gray-600">Our AI extracts transcripts, understands content context, and generates comprehensive summaries using advanced RAG technology.</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Chat & Understand</h3>
                <p className="text-gray-600">Ask questions about the video content and get intelligent, context-aware responses powered by our semantic search and Q&A system.</p>
              </div>
            </div>
          </div>

          {/* Login Required Section */}
          <SignedOut>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-20 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Sign in to access our AI-powered video understanding features. Get instant video summaries and chat with any YouTube content using advanced semantic search.
              </p>
              <SignInButton mode="modal">
                <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg mx-auto">
                  <Play className="w-5 h-5" />
                  Sign In to Access Features
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          {/* Authenticated User Section */}
          <SignedIn>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-20 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome Back!</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                You're signed in and ready to use all TubeIQ features. Access your dashboard to start summarizing videos and asking questions.
              </p>
              <Link href="/main" className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg mx-auto inline-flex">
                <Play className="w-5 h-5" />
                Go to Dashboard
              </Link>
            </div>
          </SignedIn>

          {/* About Section */}
          <div id="about" className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">About TubeIQ</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Revolutionary Video Understanding</h3>
                <p className="text-gray-600 mb-6">
                  TubeIQ leverages cutting-edge AI technology including RAG (Retrieval-Augmented Generation), semantic search, and vector databases to understand and summarize any YouTube video content with intelligent Q&A capabilities.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Automated content analysis with AI</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Intelligent video summarization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Semantic search and Q&A</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Secure authentication with Clerk</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Enterprise-grade AWS infrastructure</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Proven Results</h4>
                <p className="text-gray-600">Our users achieve 95% accuracy in video understanding and can ask complex questions about any video content with intelligent responses.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">TubeIQ</span>
          </div>
          <p className="text-gray-400 mb-6">Empowering users with AI-driven video understanding and Q&A</p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
