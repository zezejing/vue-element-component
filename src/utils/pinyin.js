import PinYin from "pinyin";
/**
 *
 * @param { String } q - 翻译的全拼key值
 * @param { String } j - 翻译的简拼key值
 * @return { Object }
 */
export default function (str, q, j) {
  q = q || "q";
  j = j || "j";
  let obj = {
    [q]: "",
    [j]: ""
  };
  if (str) {
    obj[q] =
      PinYin(str, {
        style: PinYin.STYLE_NORMAL
      }).join("") || "";
    obj[j] =
      PinYin(str, {
        style: PinYin.STYLE_FIRST_LETTER
      }).join("") || "";
  }
  return obj;
}