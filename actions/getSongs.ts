import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Song } from "@/types";

const getSongs = async (req: any, res: any): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: () => req.headers.cookie || "", // Pass cookies manually
  });

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
  }

  return (data as any) || [];
};

export default async function handler(req: any, res: any) {
  const songs = await getSongs(req, res);
  res.status(200).json({ songs });
}
