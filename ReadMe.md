### 프로젝트 목적
webrtc를 실시간 영상을 다수의 peer에게 제공하는 사이트입니다.


### 실행방법
npm run start

SyntaxError: Unexpected token '?' 뜨면 npm node install 후 재실행
Docker Redis server 실행방법
```docker run -p 6379:6379 -it redis/redis-stack-server:latest```



-------------------
## 파일 경로
1. /src/interfaces   
인터페이스 생성시 파일 하나 만들어서 여기에 추가
2. /src/Rooms.ts   
현재 생성된 Room List, 추가및 관리에 사용하는 클래스
3. /src/selectPeer.ts   
피어 선택 알고리즘 여기에

-------------------

