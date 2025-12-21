import React from 'react'
import { Sprout, Smartphone, TrendingUp, Cloud, Users, Shield, ArrowRight, Menu, X, Star, Check } from 'lucide-react';

const App = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Sprout className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">NextaField</span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-700 hover:text-green-600 transition">Features</a>
                <a href="#benefits" className="text-gray-700 hover:text-green-600 transition">Benefits</a>
                <a href="#about" className="text-gray-700 hover:text-green-600 transition">About</a>
                <a href="#contact" className="text-gray-700 hover:text-green-600 transition">Contact</a>
                <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">
                  Get Started
                </button>
              </div>

              {/* Mobile menu button */}
              <button 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-4 py-4 space-y-3">
                <a href="#features" className="block text-gray-700 hover:text-green-600">Features</a>
                <a href="#benefits" className="block text-gray-700 hover:text-green-600">Benefits</a>
                <a href="#about" className="block text-gray-700 hover:text-green-600">About</a>
                <a href="#contact" className="block text-gray-700 hover:text-green-600">Contact</a>
                <button className="w-full bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                    🌱 Smart Farming Revolution
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Grow Smarter with <span className="text-green-600">NextaField</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600">
                  Transform your farming operations with AI-powered insights, real-time monitoring, 
                  and data-driven decisions that maximize yield and minimize waste.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                    <span>Start Free Trial</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full hover:bg-green-50 transition">
                    Watch Demo
                  </button>
                </div>
                <div className="flex items-center space-x-8 pt-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">10K+</p>
                    <p className="text-gray-600 text-sm">Active Farmers</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">30%</p>
                    <p className="text-gray-600 text-sm">Yield Increase</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">24/7</p>
                    <p className="text-gray-600 text-sm">Monitoring</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-linear-to-br from-green-400 to-emerald-600 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition duration-300">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">Farm Dashboard</h3>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">LIVE</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Soil Moisture</p>
                          <p className="text-2xl font-bold text-blue-600">78%</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Temperature</p>
                          <p className="text-2xl font-bold text-orange-600">28°C</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Crop Health</p>
                          <p className="text-2xl font-bold text-purple-600">95%</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Growth Rate</p>
                          <p className="text-2xl font-bold text-green-600">+12%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating Card */}
                <div className="hidden md:block absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-xl">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="text-green-600 h-6 w-6" />
                    <div>
                      <p className="text-sm text-gray-600">Growth</p>
                      <p className="text-xl font-bold text-gray-900">+24%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Modern Farmers
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to optimize your farm operations in one intelligent platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Smartphone className="h-12 w-12 text-green-600" />,
                  title: "Mobile Monitoring",
                  description: "Track your crops from anywhere with our intuitive mobile app. Real-time alerts keep you informed."
                },
                {
                  icon: <Cloud className="h-12 w-12 text-blue-600" />,
                  title: "Weather Intelligence",
                  description: "Hyper-local weather forecasts and predictive analytics help you plan ahead with confidence."
                },
                {
                  icon: <TrendingUp className="h-12 w-12 text-purple-600" />,
                  title: "Yield Optimization",
                  description: "AI-driven recommendations to maximize productivity while reducing costs and environmental impact."
                },
                {
                  icon: <Users className="h-12 w-12 text-orange-600" />,
                  title: "Team Collaboration",
                  description: "Coordinate with your team seamlessly. Assign tasks and track progress in real-time."
                },
                {
                  icon: <Shield className="h-12 w-12 text-red-600" />,
                  title: "Pest Detection",
                  description: "Early warning system for diseases and pests using computer vision and satellite imagery."
                },
                {
                  icon: <Sprout className="h-12 w-12 text-green-600" />,
                  title: "Crop Analytics",
                  description: "Comprehensive insights into soil health, moisture levels, and nutrient management."
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition duration-300 hover:-translate-y-2"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-linear-to-br from-green-600 to-emerald-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Why Farmers Choose NextaField
                </h2>
                <div className="space-y-6">
                  {[
                    "Increase yields by up to 30% with data-driven insights",
                    "Reduce water usage by 40% through smart irrigation",
                    "Save 20+ hours per week on farm management",
                    "Lower input costs with precision agriculture",
                    "Access expert agronomist support 24/7"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-white/20 p-1 rounded-full mt-1">
                        <Check className="h-5 w-5" />
                      </div>
                      <p className="text-lg">{benefit}</p>
                    </div>
                  ))}
                </div>
                <button className="mt-8 bg-white text-green-600 px-8 py-4 rounded-full hover:bg-gray-100 transition font-semibold">
                  Learn More
                </button>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl">
                <div className="bg-white rounded-2xl p-8">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Success Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-700 mb-2">
                          <span>Crop Yield</span>
                          <span className="font-semibold">+30%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-green-600 h-3 rounded-full" style={{width: '30%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-gray-700 mb-2">
                          <span>Water Savings</span>
                          <span className="font-semibold">+40%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-blue-600 h-3 rounded-full" style={{width: '40%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-gray-700 mb-2">
                          <span>Cost Reduction</span>
                          <span className="font-semibold">+25%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-purple-600 h-3 rounded-full" style={{width: '25%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Trusted by Farmers Worldwide
              </h2>
              <div className="flex items-center justify-center space-x-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-gray-600">4.9/5 from 2,000+ reviews</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "NextaField transformed my 100-acre farm. I've seen a 35% increase in productivity and the ROI was visible within 3 months!",
                  author: "Rajesh Kumar",
                  location: "Punjab, India",
                  avatar: "RK"
                },
                {
                  quote: "The weather predictions are incredibly accurate. Saved my crops twice this season. The support team is also very responsive.",
                  author: "Sarah Williams",
                  location: "Iowa, USA",
                  avatar: "SW"
                },
                {
                  quote: "Finally, a platform that understands farming. Easy to use and incredibly powerful. My entire family can manage the farm now.",
                  author: "Carlos Silva",
                  location: "São Paulo, Brazil",
                  avatar: "CS"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
                  <div className="flex items-center space-x-1 mb-4">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.author}</p>
                      <p className="text-gray-600 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600">Choose the plan that fits your farm size</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Starter",
                  price: "₹999",
                  period: "/month",
                  description: "Perfect for small farms",
                  features: ["Up to 10 acres", "Basic analytics", "Mobile app access", "Email support"],
                  popular: false
                },
                {
                  name: "Professional",
                  price: "₹2,499",
                  period: "/month",
                  description: "Best for growing operations",
                  features: ["Up to 50 acres", "Advanced AI insights", "Weather forecasting", "Priority support", "Team collaboration"],
                  popular: true
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "",
                  description: "For large scale farms",
                  features: ["Unlimited acres", "Custom integrations", "Dedicated account manager", "24/7 phone support", "Custom training"],
                  popular: false
                }
              ].map((plan, index) => (
                <div 
                  key={index}
                  className={`bg-white p-8 rounded-2xl border-2 ${plan.popular ? 'border-green-600 shadow-2xl scale-105' : 'border-gray-200'} hover:shadow-xl transition`}
                >
                  {plan.popular && (
                    <div className="bg-green-600 text-white text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <button className={`w-full py-3 rounded-full font-semibold transition ${plan.popular ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                    Get Started
                  </button>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 bg-linear-to-r from-green-600 to-emerald-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of farmers who are already growing smarter with NextaField
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="px-6 py-4 rounded-full text-gray-900 w-full sm:w-80 focus:outline-none focus:ring-4 focus:ring-green-300"
              />
              <button className="bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition font-semibold whitespace-nowrap">
                Start Free Trial
              </button>
            </div>
            <p className="text-green-100 mt-4 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Sprout className="h-8 w-8 text-green-500" />
                  <span className="text-xl font-bold text-white">NextaField</span>
                </div>
                <p className="text-sm mb-4">Empowering farmers with smart technology for sustainable agriculture.</p>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-green-500 transition">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  </a>
                  <a href="#" className="hover:text-green-500 transition">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="#" className="hover:text-green-500 transition">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-green-500 transition">Features</a></li>
                  <li><a href="#" className="hover:text-green-500 transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-green-500 transition">Case Studies</a></li>
                  <li><a href="#" className="hover:text-green-500 transition">Integrations</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-green-500 transition">About Us</a></li>
                  <li><a href="#" className="hover:text-green-500 transition">Careers</a></li>
                  <li><a href="#" className="hover:text-green-500 transition">Blog</a></li>
                  <li><a href="#" className="hover:text-green-500 transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-green-500 transition">Help Center</a></li>
                  <li><a href="#" className="hover:text-green-500 transition">Documentation</a></li>
                  <li><a href="#" className="hover:text-green-500 transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-green-500 transition">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-sm">
              <p>© 2025 NextaField. All rights reserved. Built with ❤️ for farmers worldwide.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
