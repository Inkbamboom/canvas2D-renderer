/* eslint-disable @typescript-eslint/no-unused-vars */
const customEvent = {
  beforeDrag: () => {},
  dragging: (_x: number, _y: number) => {},
} as const;
/* eslint-disable @typescript-eslint/no-unused-vars */

// 工具类型：去掉 readonly
type Mutable<T> = { -readonly [P in keyof T]: T[P] };

type ICustomEvent = Mutable<typeof customEvent>;

export class CustomEvent {
  protected eventCollection: {
    [key in keyof ICustomEvent]: ICustomEvent[key][];
  };
  constructor() {
    this.eventCollection = (() => {
      let obj = {} as { [key in keyof ICustomEvent]: ICustomEvent[key][] };
      for (const key in customEvent) {
        obj[key as keyof ICustomEvent] = [];
      }
      return obj;
    })();
  }
  on<K extends keyof ICustomEvent>(eventType: K, callback: ICustomEvent[K]) {
    const eventList = this.eventCollection[eventType];
    if (!eventList.includes(callback)) {
      eventList.push(callback);
    }
  }

  off<K extends keyof ICustomEvent>(eventType: K, callback: ICustomEvent[K]) {
    const eventList = this.eventCollection[eventType];
    const index = eventList.indexOf(callback);
    if (index > -1) {
      eventList.splice(index, 1);
    }
  }
}
