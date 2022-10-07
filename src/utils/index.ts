import md5 from "md5";
import mitt from "mitt";
import Handle from "./handle";
import Operate from "./operate";
import Validation from "./validation";

const useMitt = mitt();
const useMD5 = (content: any) => md5(content);

export {
  useMD5,     // MD5
  useMitt,    // 事件总线
  Handle,     // 处理相关工具类
  Operate,    // 操作相关工具类
  Validation  // 验证相关工具类
}