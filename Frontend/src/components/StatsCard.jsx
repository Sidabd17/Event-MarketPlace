import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CalendarDays, Clock, History } from 'lucide-react'

const StatsCard = ({totalEvents ,upcoming , past }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="bg-sky-200">
              <CardHeader className="flex flex-row items-center justify-between ">
                <CardTitle className="text-black text-lg">Total Events</CardTitle>
                <CalendarDays className="w-6 h-6 text-blue-900" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-800">{totalEvents}</p>
                <p className="text-sm text-gray-700 mt-1">All events created</p>
              </CardContent>
            </Card>

            <Card className="bg-emerald-200">
              <CardHeader className="flex flex-row items-center justify-between ">
                <CardTitle className="text-red-900 text-lg">Upcoming</CardTitle>
                <Clock className="w-6 h-6 text-green-900" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-800">{upcoming}</p>
                <p className="text-sm text-red-700 mt-1">Yet to happen</p>
              </CardContent>
            </Card>

            <Card className="bg-red-200">
              <CardHeader className="flex flex-row items-center justify-between ">
                <CardTitle className="text-blue-900 text-lg">
                  Past Events
                </CardTitle>
                <History className="w-6 h-6 text-red-900" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-800">{past}</p>
                <p className="text-sm text-blue-700 mt-1">Already happened</p>
              </CardContent>
            </Card>
          </div>
  )
}

export default StatsCard