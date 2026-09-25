const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const MAX_STORED_CHARACTERS = 1_900_000;
const MAX_EDGE = 1400;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const prepareImageUpload = (file: File): Promise<string> => {
  if (!ALLOWED_TYPES.has(file.type)) {
    return Promise.reject(new Error('Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.'));
  }
  if (file.size > MAX_SOURCE_BYTES) {
    return Promise.reject(new Error('Ảnh gốc không được lớn hơn 10 MB.'));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc tệp ảnh.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Tệp ảnh không hợp lệ.'));
      image.onload = () => {
        try {
          const scale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
          const width = Math.max(1, Math.round(image.naturalWidth * scale));
          const height = Math.max(1, Math.round(image.naturalHeight * scale));
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('Trình duyệt không thể xử lý ảnh này.'));
            return;
          }
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          if (dataUrl.length > MAX_STORED_CHARACTERS) {
            reject(new Error('Ảnh vẫn quá lớn sau khi tối ưu. Hãy chọn ảnh nhỏ hơn.'));
            return;
          }
          resolve(dataUrl);
        } catch {
          reject(new Error('Không thể tối ưu tệp ảnh này.'));
        }
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
};
