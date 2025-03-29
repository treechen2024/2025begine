from google.generativeai import GenerativeModel, configure
import tkinter as tk
from tkinter import filedialog, messagebox

# Replace with your actual API key
API_KEY = "AIzaSyBK8Cukatlb4VjsCqcmoeZhw8Ju-peRTTo"

# Configure the API key
configure(api_key=API_KEY)

# Initialize the model
model = GenerativeModel('gemini-1.5-pro')

def generate_and_save():
    prompt = prompt_entry.get()
    if not prompt:
        messagebox.showerror("錯誤", "請輸入提示語！")
        return

    try:
        response = model.generate_content(prompt)
        generated_text = response.text
        result_text.delete(1.0, tk.END)
        result_text.insert(tk.END, generated_text)

        save_path = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")],
            title="儲存結果"
        )

        if save_path:
            with open(save_path, "w", encoding="utf-8") as f:
                f.write(generated_text)
            messagebox.showinfo("成功", f"結果已儲存至：{save_path}")

    except Exception as e:
        messagebox.showerror("錯誤", f"發生錯誤：{e}\n請確認 API 金鑰是否正確，並已安裝所需套件。")

# Create the main window
window = tk.Tk()
window.title("Gemini 內容產生器")

# Prompt input
prompt_label = tk.Label(window, text="輸入提示語：")
prompt_label.pack(pady=5)
prompt_entry = tk.Entry(window, width=50)
prompt_entry.pack(pady=5)

# Generate button
generate_button = tk.Button(window, text="產生並儲存", command=generate_and_save)
generate_button.pack(pady=10)

# Result display
result_label = tk.Label(window, text="產生結果：")
result_label.pack(pady=5)
result_text = tk.Text(window, height=10, width=60)
result_text.pack(pady=5)

# Run the GUI
window.mainloop()