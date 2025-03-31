/* eslint-disable react/prop-types */
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import useFetch from "@/hooks/UseFetch";
import { updateApplicationStatus } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChangeChange = (status) => {
    fnHiringStatus(status);
  };

  return (
    <Card className="w-full md:w-96 mx-auto">
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between items-center font-bold">
          <span className="text-center">{isCandidate ? `${application?.job?.title} at ${application?.job?.company?.name}` : application?.name}</span>
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col sm:flex-row justify-between gap-1">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={18} />
            {application?.experience} years of experience
          </div>
          <div className="flex gap-2 items-center">
            <School size={15} />
            {application?.education}
          </div>
          <div className="flex gap-2 items-center">
            <Boxes size={20} />
            Skills: {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xs sm:text-sm">{new Date(application?.created_at).toLocaleString()}</span>
        {isCandidate ? (
          <span className="capitalize font-bold text-xs sm:text-sm">
            Status : {application?.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChangeChange}
            defaultValue={application.status}
            className="w-full sm:w-52"
          >
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
