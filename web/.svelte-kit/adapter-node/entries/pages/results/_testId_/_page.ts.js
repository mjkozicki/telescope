import { redirect, error } from "@sveltejs/kit";
const load = async ({ params, fetch }) => {
  const { testId } = params;
  try {
    throw redirect(307, `/results/${testId}/overview`);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err && err.status === 307) {
      throw err;
    }
    throw error(404, {
      message: `Test result "${testId}" not found`
    });
  }
};
export {
  load
};
