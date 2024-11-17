"use client";
"use client";

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ClipboardIcon, BarChartIcon, LinkIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


const URL = "https://url-backend-0q3u.onrender.com";

interface UrlData {
  shortId: string
  redirectUrl: string
  createdAt: string
}

interface AnalyticsData {
  totalClicks: number
  analytics: { timestamp: number }[]
}

export default function UrlShortener() {
  const [url, setUrl] = useState('')
  const [shortenedUrls, setShortenedUrls] = useState<UrlData[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [selectedShortId, setSelectedShortId] = useState('')

  useEffect(() => {
    fetchRecentUrls()
  }, [])

  const fetchRecentUrls = async () => {
    try {
      const response = await axios.get(`${URL}/url/recent`)
      setShortenedUrls(response.data)
    } catch (error) {
      console.error('Error fetching recent URLs:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${URL}/url`, { url })
      setShortenedUrls([response.data.newUrl, ...shortenedUrls])
      setUrl('')
    } catch (error) {
      console.error('Error shortening URL:', error)
    }
  }

  const copyToClipboard = (shortId: string) => {
    navigator.clipboard.writeText(`${URL}/${shortId}`)
  }

  const fetchAnalytics = async (shortId: string) => {
    try {
      const response = await axios.get(`${URL}/url/analytics/${shortId}`)
      setAnalytics(response.data)
      setSelectedShortId(shortId)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  return (
    <div className="bg-slate-900 min-h-screen p-4  text-slate-100">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-6xl font-bold mb-2 text-center text-cyan-400 mt-6">LinkSnip</h1>
        <p className="text-xl mb-8 text-center text-slate-400">Snip, share, and track your links in a snap</p>
        
        <Card className="mb-8 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-cyan-300 flex items-center gap-2">
              <LinkIcon className="w-6 h-6" />
              Shorten a URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter a long URL"
                required
                className="flex-grow bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
              />
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">Shorten</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-cyan-300 flex items-center gap-2">
              <BarChartIcon className="w-6 h-6" />
              Recent Shortened URLs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-700">
                  <TableHead className="text-slate-300">Original URL</TableHead>
                  <TableHead className="text-slate-300">Short URL</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shortenedUrls.map((item) => (
                  <TableRow key={item.shortId} className="border-b border-slate-700 hover:bg-slate-700 cursor-pointer">
                    <TableCell className="font-medium text-slate-300">{item.redirectUrl}</TableCell>
                    <TableCell className="text-cyan-400">{`http://localhost:3000/${item.shortId}`}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(item.shortId)} className="mr-2 text-slate-400 hover:text-white hover:bg-slate-700">
                        <ClipboardIcon className="h-4 w-4" />
                        <span className="sr-only">Copy short URL</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => fetchAnalytics(item.shortId)} className="text-slate-400 hover:text-white hover:bg-slate-700">
                        <BarChartIcon className="h-4 w-4" />
                        <span className="sr-only">View analytics</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {analytics && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-cyan-300 flex items-center gap-2">
                <BarChartIcon className="w-6 h-6" />
                Analytics for {selectedShortId}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-xl text-slate-300">Total Clicks: <span className="text-cyan-400 font-bold">{analytics.totalClicks}</span></p>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-700">
                    <TableHead className="text-slate-300">Visit Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.analytics.map((visit, index) => (
                    <TableRow key={index} className="border-b border-slate-700">
                      <TableCell className="text-slate-300">{new Date(visit.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}