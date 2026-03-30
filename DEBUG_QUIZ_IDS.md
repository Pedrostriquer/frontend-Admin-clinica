# Debugging Guide: Quiz Alternative IDs Issue

## Problem
Question 2's alternatives are being created with numeric IDs (1, 2) instead of string IDs (A, B).

## Step-by-Step Debugging

### 1. **Clear Browser Cache and Reload**
   - **Chrome/Edge**: Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Clear "All time" data
   - Then reload with `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - This ensures you're running the latest code, not a cached version

### 2. **Check Browser Developer Console**
   - Open DevTools (`F12`)
   - Go to **Console** tab
   - Create a new quiz and add 2 questions
   - Watch for these logs:

   **When you click "Add Question" after Question 1:**
   ```
   🔵 ANTES de adicionar pergunta #1:
   🟢 Reset currentQuestion para pergunta #2:
   ```

   **When you click "Add Alternative" to add C and D:**
   ```
   🟡 handleAddAlternative chamado:
   ```

   Check the output - are the IDs definitely strings ("A", "B", "C", "D")?

### 3. **Check the Final Submission Logs**
   - When you click "Criar Quiz", look for:
   ```
   📤 Enviando quiz para API:
   formData.questions: [...]
   🔍 ANÁLISE DETALHADA DOS IDs:
   ```

   **THIS IS THE KEY LOG** - it shows exactly what's being sent to the API
   - For Question 1: Should show `id="A"` (tipo: string), `id="B"` (tipo: string), etc.
   - For Question 2: Should show `id="A"` (tipo: string), `id="B"` (tipo: string), etc.

### 4. **Check Backend Logs**
   - Open your backend application output/console
   - Look for the section with many `=` marks:
   ```
   ============================================================
   📥 RECEBIDO NO CONTROLLER:
   ============================================================
   ```

   - Check each alternative's ID and type
   - Note if Question 2's first two alternatives show `tipo: Int32` or similar

### 5. **Network Tab Analysis**
   - In DevTools, go to **Network** tab
   - Create a quiz and submit
   - Find the POST request to `/api/BlogGemCapital/BlogGemCapitalQuizzes`
   - Click on it and go to **Request** tab
   - Look at the JSON body - scroll to Question 2's alternatives
   - You'll see the raw JSON being sent

### 6. **Specific Test Case**
   Try this exact sequence:
   ```
   1. Quiz Name: "Test"
   2. Add Question 1: "What is this?"
   3. Add alternatives: text for A and B
   4. Click "Add Question"
   5. Type Question 2 text: "What is that?"
   6. Add alternatives: text for A and B
   7. Click "Add Alternative" → Add C with text
   8. Click "Add Alternative" → Add D with text
   9. Click "Criar Quiz"
   10. CHECK ALL LOGS from steps 2-4 above
   ```

### 7. **Possible Root Causes**

   | Cause | How to Check |
   |-------|-------------|
   | Browser cache | Clear cache, reload with Ctrl+Shift+R |
   | Different component version | Check Network tab Request body |
   | React state issue | Check console logs during Add Alternative |
   | Backend parsing issue | Check backend console logs |
   | API client issue | Check Network tab Request body vs frontend logs |

## Information to Share

Once you run through this debugging, collect:
1. **Frontend Console Logs** - Copy the entire 🔍 ANÁLISE DETALHADA DOS IDs section
2. **Network Request Body** - The JSON from the Network tab
3. **Backend Console Logs** - The full 📥 RECEBIDO NO CONTROLLER section
4. **Exact steps** you took to reproduce the issue

This will pinpoint exactly where the numeric IDs are coming from!
