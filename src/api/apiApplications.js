import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: StorageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (StorageError) {
    console.error("Error Uploading resumes", StorageError);
    return null;
  }

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select("*, job:jobs(title),company:companies(name)");

  if (error) {
    console.error("Error Submitting Applications", error);
    return null;
  }
  return data;
}

export async function updateApplicationStatus(token, { job_id }, status) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error updating Applications", error);
    return null;
  }

  return data;
}


export async function getApplications(token , {user_id}) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("applications")
    .select("*,job:jobs(title,company:companies(name))")
    .eq("candidate_id", user_id)
    

  if (error) {
    console.error("Error Fetching Applications", error);
    return null;
  }

  return data;
}