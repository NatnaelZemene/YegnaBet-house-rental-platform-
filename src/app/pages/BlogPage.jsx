import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react';

function BlogPage({ onNavigate }) {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Neighborhoods in Addis Ababa for Young Professionals",
      excerpt: "Discover the best areas in Addis Ababa that offer great amenities, connectivity, and lifestyle for young professionals.",
      author: "YegnaBet Team",
      date: "December 15, 2024",
      image: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Essential Tips for First-Time Renters in Ethiopia",
      excerpt: "Everything you need to know before renting your first property in Ethiopia, from documentation to negotiation tips.",
      author: "Property Expert",
      date: "December 10, 2024",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "How to Maximize Your Property's Rental Income",
      excerpt: "Property owners share their strategies for attracting quality tenants and maximizing rental returns.",
      author: "Real Estate Advisor",
      date: "December 5, 2024",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=400&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">YegnaBet Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Insights, tips, and stories from the Ethiopian property market
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Featured Post */}
          <div className="mb-12">
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {blogPosts[0].author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {blogPosts[0].date}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-gray-700 mb-6">
                    {blogPosts[0].excerpt}
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{post.excerpt}</p>
                  <Button variant="outline" className="w-full">
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest insights about the Ethiopian property market, 
              rental tips, and exclusive offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;