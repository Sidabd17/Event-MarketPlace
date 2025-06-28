import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const JoinedMovies = ({ tickets }) => {
  return (
    <div className="rounded-md border mt-5 mb-10 bg-gradient-to-b from-red-100 to-white dark:from-[#192942] dark:to-[#0e233a] p-4 shadow-sm">
      <Table className={"w-full text-sm "}>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Theatre</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets?.map((ticket) => (
            <TableRow key={ticket._id}>
              <TableCell className="font-medium">{ticket.movieTitle}</TableCell>
              <TableCell>{new Date(ticket.date).toLocaleDateString()}</TableCell>
              <TableCell>{ticket.showtime}</TableCell>
              <TableCell>{ticket.theater}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default JoinedMovies;