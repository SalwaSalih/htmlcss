/* =========================================================
   TEACHER SETTINGS – the only file the teacher needs to change
   ---------------------------------------------------------
   "Send to teacher" opens your Google Form with the student's
   name and a link to their code already filled in.

   How to set it up (once):
   1. Make a Google Form with three "Short answer" questions:
        Name   ·   Link to my code   ·   Class code
      (Settings: turn OFF "Restrict to users in ..." / sign-in,
       so students don't need a Google account.)
   2. In the form: ⋮ menu → "Get pre-filled link".
      Type  NAME  in the first answer, LINK in the second and
      CODE  in the third. Click "Get link" → "Copy link".
   3. Paste that link between the quotes below and save the file.
   4. Class code (stops strangers from sending answers):
      on the "Class code" question: ⋮ → "Response validation" →
      Regular expression · Matches · your code, e.g. ROJ7B
      (error text: "Wrong class code"). Make the question Required.
      Tell the code to the class – do NOT write it in this file,
      because everything here is public. Change it when you like.

   Nothing here is secret: it's the same link you would give
   students anyway. NEVER put a password or API key in this site –
   everything in these files is public.

   If the link is empty, students can still use "Copy link"
   and send it to you another way.
========================================================= */
window.HM_TEACHER = {
  formLink: ""
};
