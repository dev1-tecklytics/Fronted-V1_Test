# Debugging Workflow Dropdown Issue

## Steps to Debug:

### 1. Check Browser Console Logs

After my code changes, the Code Review Tool will now log detailed information. Please:

1. Open your browser to http://localhost:5173
2. Log in with your user account
3. Open Browser DevTools (F12) → Console tab
4. Navigate to the Code Review Tool page
5. Look for logs starting with `[CodeReviewTool]`

**What to check:**

- How many projects are found?
- For each project, is the history endpoint being called?
- What does the history response contain?
- Are any workflows being added to the list?

### 2. Check Network Tab

In Browser DevTools → Network tab:

1. Clear the network log
2. Refresh the Code Review Tool page
3. Look for these requests:
   - `GET /api/v1/projects` - Should return your projects
   - `GET /api/v1/analyze/history?project_id=XXX` - Should return analysis records

**For each request, check:**

- Status code (should be 200)
- Response body - what data is returned?
- Are there any 404 or 500 errors?

### 3. Verify Upload Created Records

After uploading and analyzing files:

1. Go to Project Workspace
2. Upload a file
3. Click "Upload and Analyze"
4. Check the Network tab for:
   - `POST /api/v1/analyze/uipath?project_id=XXX`
   - Check the response - does it include an `analysis_id`?
   - Note down the `analysis_id` value

5. Then manually check if that record exists:
   - In Network tab, find the `GET /api/v1/analyze/history?project_id=XXX` request
   - Check if the response includes the `analysis_id` you noted

### 4. Check Backend Database

If you have access to the backend database:

```sql
-- Check if analysis records exist
SELECT * FROM analysis_history
WHERE project_id = 'YOUR_PROJECT_ID'
ORDER BY created_at DESC;

-- Check user association
SELECT ah.*, p.name as project_name, p.user_id
FROM analysis_history ah
JOIN projects p ON ah.project_id = p.project_id
WHERE p.user_id = 'YOUR_USER_ID';
```

### 5. Common Issues & Fixes

#### Issue A: History endpoint returns empty array

**Cause:** Analysis records not being saved to database
**Fix:** Check backend `/analyze/uipath` endpoint - ensure it's creating database records

#### Issue B: History endpoint returns 404

**Cause:** Endpoint doesn't exist or route not registered
**Fix:** Check backend routes - ensure `/analyze/history` is registered

#### Issue C: Projects found but no history

**Cause:** User/Project ID mismatch - analysis saved under different user
**Fix:** Check that `project_id` in upload matches `project_id` in history query

#### Issue D: History exists but workflows array is empty

**Cause:** Frontend filtering logic issue
**Fix:** Check the console logs to see if workflows are being filtered out

### 6. Quick Test

To quickly test if the issue is frontend or backend:

1. Open Browser Console
2. Run this command:

```javascript
// Test the API directly
const projectId = "YOUR_PROJECT_ID"; // Replace with actual project ID
fetch(`http://localhost:8000/api/v1/analyze/history?project_id=${projectId}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "X-API-Key": localStorage.getItem("apiKey"),
  },
})
  .then((r) => r.json())
  .then((data) => console.log("History Response:", data))
  .catch((err) => console.error("Error:", err));
```

This will show you exactly what the backend is returning.

## Expected Console Output

After the fix, you should see logs like this:

```
🔍 [CodeReviewTool] Starting to load workflows...
📂 [CodeReviewTool] Found 2 projects: [{...}, {...}]
🔎 [CodeReviewTool] Fetching history for project: My Project (ID: proj_123)
📊 [CodeReviewTool] History for My Project: [{analysis_id: "ana_456", file_name: "workflow.xaml", ...}]
✅ [CodeReviewTool] Found 1 analysis records for My Project
  ➕ [CodeReviewTool] Adding workflow: workflow.xaml (ID: ana_456, Status: completed)
📋 [CodeReviewTool] Total workflows loaded: 1
✅ [CodeReviewTool] Selected first workflow: workflow.xaml
```

## Next Steps

Once you've gathered the debugging information:

1. **If projects are found but history is empty:**
   - The issue is in the backend - analysis records aren't being saved or retrieved

2. **If history has data but workflows array is empty:**
   - The issue is in the frontend filtering logic

3. **If you see errors in the console:**
   - Share the error message and we'll fix it

Please run through these steps and let me know what you find in the console logs!
