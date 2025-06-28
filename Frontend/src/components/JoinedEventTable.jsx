import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const JoinedEventTable = ({ joinedEvents }) => {
  return (
    <div className="rounded-md border mt-5 mb-10 bg-gradient-to-b from-green-50 to-white dark:from-[#182841] dark:to-[#0d2136] p-4 shadow-sm">
      <Table className={"w-full text-sm "}>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Venue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {joinedEvents?.map((event) => (
            <TableRow key={event._id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
              <TableCell>{event.time}</TableCell>
              <TableCell>{event.venue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default JoinedEventTable;