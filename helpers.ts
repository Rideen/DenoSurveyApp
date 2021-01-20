export const fileExists = async (filename: string): Promise<boolean> => {
  try {
    const stats = await Deno.lstat(filename);
    return stats && stats.isFile;
  } catch(e) {
    if(e && e instanceof Deno.errors.NotFound) {
      return false;
    } else {
      throw e;
    }
  }
}