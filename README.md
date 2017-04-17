# nodejs-urlshortener
- urlshortener. made by nodejs

## DB
- MySQL을 사용하였으며 DB설정은 db폴더의 db-config-sample.json의 양식에 따라서 같은 폴더에 db-config.json으로 작성 필요.

## Trouble Shooting
- 만들어보면서 배운다는 생각으로 하다보니 좀 덜 체계적이었던것 같다
- 처음만든 버전은 Call-back 중첩이 심했고, 예외처리도 다 중첩이었다
- Promise Pattern을 적용한다고 Bluebird를 썼는데, promisify를 해줘야 Async Method를 찾는다는걸 알았다
- 나가야 될 곳에서 return을 안했더니 헤더 중첩이 생겨서 그 부분을 여러 번 수정해야했다
  - 절차적으로 생각해서 그런듯
- 비동기방식이라는 점 때문에 분기를 넣어서 중첩을 방지했는데, 이게 맞는건진 좀 더 찾아봐야 될 것같다.
- Promise를 적용했지만 좀 더 명확한 표현이 나오게 해야할 것 같다
