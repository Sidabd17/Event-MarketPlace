import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const AttendeesTable = ({ attendees }) => {
  return (
    <div className="rounded-md border mt-5">
      <Table className={"w-full text-sm"}>
        <TableHeader>
          <TableRow>
            <TableHead>Profile</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Interests</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendees?.map((attendee) => (
            <TableRow key={attendee._id}>
              <TableCell>
                <img
                  src={attendee?.profile?.profilePhoto || `https://api.dicebear.com/6.x/initials/svg?seed=${attendee.name}`}
                  alt={attendee.name}
                  className="w-10 h-10 rounded-full"
                />
              </TableCell>
              <TableCell className="font-medium">{attendee?.name}</TableCell>
              <TableCell>{attendee?.email}</TableCell>
              <TableCell>{attendee?.profile?.interests?.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AttendeesTable;
