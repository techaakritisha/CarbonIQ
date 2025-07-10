"use client"

import {
  Leaf,
  TreePine,
  Recycle,
  User,
  CheckCircle,
  Target,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Clock,
  Award,
  Zap,
  Trash2,
  Car,
  Droplets,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPagePreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-25 via-white to-teal-25">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Hero Illustration */}
            <div className="relative mx-auto w-80 h-80 mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-8 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full opacity-30 animate-pulse delay-300"></div>
              <div className="absolute inset-16 bg-gradient-to-br from-emerald-300 to-teal-300 rounded-full opacity-40 animate-pulse delay-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="flex items-center space-x-4">
                    <TreePine className="h-16 w-16 text-emerald-600 animate-bounce" />
                    <Leaf className="h-20 w-20 text-emerald-500 animate-bounce delay-200" />
                    <Recycle className="h-14 w-14 text-teal-600 animate-bounce delay-400" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-emerald-800 mb-6 leading-tight">
              Helping individuals turn{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                everyday habits
              </span>{" "}
              into real climate impact
            </h1>
            <p className="text-xl sm:text-2xl text-emerald-700 max-w-3xl mx-auto leading-relaxed">
              EcoMeter makes sustainable living simple, engaging, and measurable — one daily choice at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 sm:px-6 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl">
          <div className="animate-in fade-in slide-in-from-left-4 duration-1000">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/3">
                <div className="relative w-64 h-64 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 rounded-full opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="h-12 w-12 text-orange-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="text-4xl">🤔</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-2/3">
                <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-6">What's the problem?</h2>
                <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
                  <p>
                    Most people want to live more sustainably, but they don't realize how much their daily choices
                    actually impact the environment.
                  </p>
                  <p>
                    Without clear feedback or simple tracking tools, it's hard to know if you're making progress or
                    which changes matter most.
                  </p>
                  <p className="text-emerald-700 font-medium">
                    The result? Good intentions that don't translate into lasting, measurable change.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-6">Our Solution</h2>
            <p className="text-xl text-emerald-700 max-w-3xl mx-auto">
              EcoMeter transforms sustainable living into an engaging, measurable journey with clear progress and
              actionable insights.
            </p>
          </div>

          {/* Process Flow */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              {[
                { icon: User, label: "User", color: "emerald" },
                { icon: CheckCircle, label: "Check-in", color: "teal" },
                { icon: Target, label: "EcoScore", color: "emerald" },
                { icon: Lightbulb, label: "Tips", color: "amber" },
                { icon: TrendingUp, label: "Progress", color: "indigo" },
                { icon: Sparkles, label: "Change", color: "emerald" },
              ].map((step, index) => (
                <div key={step.label} className="text-center relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br from-${step.color}-100 to-${step.color}-50 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg`}
                  >
                    <step.icon className={`h-8 w-8 text-${step.color}-600`} />
                  </div>
                  <div className="text-sm font-medium text-slate-700">{step.label}</div>
                  {index < 5 && (
                    <div className="hidden lg:block absolute top-8 left-full w-8 -translate-x-4">
                      <ChevronRight className="h-4 w-4 text-slate-400 mx-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Clock,
                  title: "Daily Tracking",
                  description: "Quick check-ins for transportation, energy, waste, and consumption habits",
                },
                {
                  icon: Target,
                  title: "EcoScore",
                  description: "Instant feedback on your environmental impact with a clear 1-10 rating",
                },
                {
                  icon: Lightbulb,
                  title: "Personalized Tips",
                  description: "Custom suggestions based on your habits and score to maximize impact",
                },
                {
                  icon: Award,
                  title: "Motivation",
                  description: "Streaks, badges, and progress tracking to keep you engaged long-term",
                },
              ].map((feature, index) => (
                <Card
                  key={feature.title}
                  className="border-emerald-200 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Vision Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-emerald-50 via-white to-teal-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-6">Real Impact, Real Numbers</h2>
            <p className="text-xl text-emerald-700 max-w-3xl mx-auto">
              Small daily changes add up to significant environmental impact when we all participate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            {[
              {
                icon: Zap,
                stat: "200+ kg",
                description: "CO₂ saved per year",
                detail: "by reducing AC usage just 1 hour daily",
                color: "amber",
              },
              {
                icon: Trash2,
                stat: "365 bags",
                description: "plastic avoided annually",
                detail: "when 100 users skip single-use plastic",
                color: "emerald",
              },
              {
                icon: Car,
                stat: "2.6 tons",
                description: "CO₂ reduction per person",
                detail: "by choosing public transport twice weekly",
                color: "teal",
              },
              {
                icon: Droplets,
                stat: "4,500 gallons",
                description: "water saved yearly",
                detail: "with 5-minute showers instead of 10",
                color: "blue",
              },
              {
                icon: TreePine,
                stat: "50 trees",
                description: "equivalent impact",
                detail: "from one person's yearly eco habits",
                color: "emerald",
              },
              {
                icon: Sparkles,
                stat: "1,000+",
                description: "positive changes",
                detail: "made by our community daily",
                color: "indigo",
              },
            ].map((impact, index) => (
              <Card
                key={impact.stat}
                className="border-emerald-200 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br from-${impact.color}-100 to-${impact.color}-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <impact.icon className={`h-8 w-8 text-${impact.color}-600`} />
                  </div>
                  <div className={`text-3xl font-bold text-${impact.color}-700 mb-2`}>{impact.stat}</div>
                  <div className="text-lg font-semibold text-slate-800 mb-2">{impact.description}</div>
                  <div className="text-sm text-slate-600 leading-relaxed">{impact.detail}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Community Impact */}
          <div className="mt-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <div className="bg-gradient-to-r from-emerald-100 via-white to-teal-100 rounded-2xl p-8 border border-emerald-200">
              <h3 className="text-2xl font-bold text-emerald-800 mb-4">Together, We're Making a Difference</h3>
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">10,000+</div>
                  <div className="text-slate-600">Daily check-ins completed</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-teal-600 mb-2">500+</div>
                  <div className="text-slate-600">Tons of CO₂ prevented</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">95%</div>
                  <div className="text-slate-600">Users report lasting habit changes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="mb-12">
              <div className="relative mx-auto w-32 h-32 mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-emerald-300 to-teal-300 rounded-full animate-pulse delay-200"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf className="h-16 w-16 text-white animate-bounce" />
                </div>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-emerald-800 mb-6">
                Join EcoMeter and be part of the change
              </h2>
              <p className="text-xl text-emerald-700 max-w-2xl mx-auto mb-8 leading-relaxed">
                Every small action counts. Start tracking your eco-friendly habits today and watch your positive impact
                grow.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Tracking Now
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-sm text-emerald-600">
                Join thousands of users making a measurable difference for our planet 🌍
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
