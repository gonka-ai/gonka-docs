# Запуск "майнинга" GNK-токенов на своих либо арендованных GPU

**Host** (**поставщик оборудования** или **узел (node)**) предоставляет вычислительные ресурсы сети и получает вознаграждение в токенах GNK — пропорционально объёму и качеству предоставленных мощностей.

Чтобы присоединиться к майнингу в роли Host-а вам потребуется:
1. **Локальная машина**, на которой вы создадите **счет (Account)**, к которому будут привязаны ваши вычислительные ресурсы и поступающее за них вознограждение (GNK-токены). На этой машине будет храниться **Account Key** - основной ключ, имея который можно получить доступ к вашим GNK-токенам. В роли такой машины, например, могут выступать ваш комьютер или ноутбук. 
2. **Сервер с подключенными к нему GPU**, на которых вы запустите сервисы, непосредственно производящие ML-операции и зарабатывающие токены.

В инструкции описывается
 - какие команды надо выполнить, чтобы присоединиться к майнингу и зарабатывать GNK-токены;
 - варианты, где можно арендовать подходящие сервера с GPU;
 - как подсоединить кошельки [Keplr](https://www.keplr.app/) или [Leap](https://www.leapwallet.io/) для управления GNK;
 - ответы на частые вопросы, которые возникают у присоединяющихся.

Авторы инструкции сталкивались с разными конфигурациями и постарались их учесть. Но, если вы сталкиваетесь с ошибкой или чем-то непонятным - не стоит бояться, вы можете сначала спросить совета у GPT, например, промптом "Помоги разобраться с проблемой, которая возникла при попытке подключиться к gonka.ai <копируете максимально длинный лог с ошибкой>". Если вдруг не поможет, спросить совет в [Discord](https://discord.com/invite/RADwCT2U6R), там есть дружелюбное комьюнити на русском языке.

## Вам потребуются
 - навыки запуска команд в терминале на Mac/Linux или в аналогичных инструментах для Windows, например, PuTTY.
 - наличие своих GPU-машинок либо денег на их аренду (минимальная цена на ноябрь 2025 - $20, это за день "майнинга").
 - пароль, который вам надо будет указывать при генерации и использовании ключей доступа к аккаунту. Его важно запомнить либо хранить в защищенном от других месте. В инструкции будет использоваться пример пароля 'PaSSWoRD123'.

## Установка и создание Account-а на локальной машине (например, вашем компьютере или ноутбуке)
### [Локально] Установка
1. Скачайте последнюю версию `inferenced` из [GitHub releases](https://github.com/gonka-ai/gonka/releases). Пояснения, как выбрать нужный архив под ваш компьютер либа ноутбук, собраны внизу, под вопросом "Как выбрать нужный архив c `inferenced` под ваш компьютер или ноутбук?".
2. Распакуйте архив
3. Для Mac/Linux сделайте файл испольняемым командой:
```bash
chmod +x inferenced
```
Возможно, вам также потребуется команда
```bash
xattr -d com.apple.quarantine inferenced
```
Чтобы разрешить запускать файл через UI, вам возможно потребуется зайти в `System Settings` → `Privacy & Security`, промотать вниз в предупреждению про `inferenced` и разрешить его запуск всегда кликом по `Allow Anyway`.

### [Локально] Создание Аккаунта и ключа для доступа
1. Переместите `inferenced` в папку, где будут храниться данные о вашем Gonka-аккаунте. Поскольку там будут лежать ключи доступа к вашим GNK-токенам, важно, чтобы эта папка находилась на вашей локальной машине (например, компьютере или ноутбуке).
2. Запустите команду:
```bash
./inferenced keys add gonka-account-key --keyring-backend file
```

Вас спросят про пароль и покажут данные созданного аккаунта: адрес и публичный ключ (pubkey->"key").
```
❯ ./inferenced keys add gonka-account-key --keyring-backend file
Enter keyring passphrase (attempt 1/3):
Re-enter keyring passphrase:

- address: gonka1rk52j24xj9ej87jas4zqpvjuhrgpnd7h3feqmm
  name: gonka-account-key
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Au+a3CpMj6nqFV6d0tUlVajCTkOP3cxKnps+1/lMv5zY"}'
  type: local


**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

pyramid sweet dumb critic lamp various remove token talent drink announce tiny lab follow blind awful expire wasp flavor very pair tell next cable
```

Отлично, ваш аккаунт и ключи созданы. Сохраните адрес (в примере gonka1rk52j24xj9ej87jas4zqpvjuhrgpnd7h3feqmm) и публичный ключ (в примере Au+a3CpMj6nqFV6d0tUlVajCTkOP3cxKnps+1/lMv5zY).

Получить приватный ключ можно командой
```
./inferenced keys export gonka-account-key --keyring-backend file  --unarmored-hex --unsafe
```
**Важно** полученный приватный ключ не стоит хранить в открытую, с ним любой человек может получить доступ к вашему аккаунту. Сам ключ может потребоваться, например, для подключения кошельков [Keplr](https://www.keplr.app/) или [Leap](https://www.leapwallet.io/).

### [Локально] Создаем ключ для захода на сервер с GPU
Ключ потребуется чтобы выполнять действия на сервере, например, на арендованном сервере с GPU (как это сделать, смотри в следующем шаге "Варианты аренды и конфигурации серверов с GPU").
Команда создаст 2 файла ключа: публичный ключ (c ".pub" в конце) и приватный ключ по указанному вами пути (програма спросит его после запуска команды).
```
ssh-keygen -t ed25519 -C "vast_mac_pro"
```

Публичный ключ может потребоваться указать, например, при аренде сервера с GPU. Посмотреть его можно одной из команд:
```
less <path/to/public/key/file>
nano <path/to/public/key/file>
```

## Варианты аренды и конфигурации серверов с GPU.
Если у вас уже есть сервер с GPU, этот шаг можно пропустить.

Нужен сервер с одной из [следующих NVIDIA GPU](https://gonka.ai/host/hardware-specifications/). Некоторые из них:
 - H200 - самая мощная и новая (и самая дорогая)
 - RTX 4090, VRAM 24 GB (потребуется минимум 2 GPU на ML-ноду) - дешевая и распространенная
 - RTX A6000, VRAM 48 GB,	Ampere, RTX 30 Series, H100, A100 - промежуточные варианты

Кроме характеристик GPU рекомендуется:
 - Диск > 150Gb (Чтобы точно влезли веса моделей Hugging Face)
 - Доступность (Reliability) > 99 (Чем выше это число, тем менее вероятно, что ваш "майнинг" будет оштрафован за неработоспособность)

Необходимо, чтобы на сервере можно было запускать docker-сервисы (многие сервера на хостингах имеют ограниченные разрешения, например, случайный сервер с Vast скорее всего не подойдет, лучше выбирать сервера с приведенной конфигурацией).

Обзор вариантов аренды подходящих серверов с GPU:
1. Vast AI - [конфигурация Ubuntu 22.04 VM](https://cloud.vast.ai/?ref_id=343982&creator_id=343982&name=Ubuntu%2022.04%20VM) - самая дешевая конфигурация по нашим данным, проверено на 5 установках. Единственная проблема, у Vast часто заканчиваются пригодные машинки данной конфигурации, иногда ощущается не 100% Realibility.
2. [Runpod](https://runpod.io?ref=204dxwjf) - чуть дороже Vast, но на нем больше доступных вариантов
3. [Tensordock](https://dashboard.tensordock.com/deploy?_gl=1*10mgctb*_gcl_au*MTY3MzE3MTE4NS4xNzYxOTg5NTcw*_ga*NDY1MzYwOTYuMTc2MTk4OTU3MA..*_ga_P5VZBVFLDE*czE3NjI5Njg5NzkkbzMkZzEkdDE3NjI5Njk4MjUkajYwJGwwJGgw) - содержит GPU требуемых характеристик, но успешно запустить на нем "майнинг" не получилось, предположительно из-за "Ротаций IP", которые приводили к временной недоступности серверов. 
4. [Hyperstack](https://www.hyperstack.cloud/gpu-pricing) - не тестировали, поскольку он не содержит дешевых GPU 4090, и в целом недешевый
5. [Hyperbolic](https://app.hyperbolic.ai/invite/3TJwPWiUQ2) - не тестировали, в доступе исключительно дорогие мощные варианты
6. [Lambda AI](https://lambda.ai/service/gpu-cloud) - не тестировали, в доступе исключительно дорогие мощные варианты
7. [Nebius](https://nebius.com/services/compute) - не тестировали
8. [Jarvislabs](https://jarvislabs.ai/) - не тестировали

## Установка на сервере
### [На сервере] Заходим на сервер
Команда вида
```bash
ssh -i <path/to/your/keys/folder> -p 63202 root@122.29.135.205 -L 8080:localhost:8080
```
В случае арендованной машинки команда для подключения наверняка будет указана. Тогда вам лучше взять ее и подставить `-i <path/to/your/keys/folder>` если потребуется.

### [На сервере] Клонируем и настраиваем данные на сервере
Выполняем команды для скачивания актуальной версии проекта на сервер:
```bash
git clone https://github.com/gonka-ai/gonka.git -b main && \
cd gonka/deploy/join
```

Копируем конфиг чтобы отредактировать его:
```
cp config.env.template config.env
```

#### [На сервере] Редактируем "config.env"
Открыть файл для редактирования можно, например, командой `nano`. Если нужны подробности, они есть внизу, в "Как редактировать файлы на сервере?"

Нужно отредактировать следующие строки как написано в комментариях:
  ```
  export KEY_NAME=<My_Node_11323>								    # уникальный идентификатор вашей ноды
  export KEYRING_PASSWORD=<PaSSWoRD123>                  # Пароль
  export API_PORT=8000									    # Доступный порт на машине, скорее всего нужно оставить 8000
  export PUBLIC_URL=http://<HOST>:<PORT>					   # URL сервера, по которому к нему можно подключиться извне. Скорее всего HOST = IP адрес, по которому вы заходили на сервер; а PORT = 8000
  export P2P_EXTERNAL_ADDRESS=tcp://<HOST>:<PORT>		      # URL сервера, по которому к нему можно подключиться извне для P2P. Скорее всего HOST = IP адрес, по которому вы заходили на сервер; а PORT = 5000
  export ACCOUNT_PUBKEY=<ACCOUNT_PUBKEY_FROM_STEP_ABOVE>      # Используйте публичный клюк аккаунта без кавычек, получали его выше на локальной машине, в примере `Au+a3CpMj6nqFV6d0tUlVajCTkOP3cxKnps+1/lMv5zY`
  export NODE_CONFIG=./node-config.json					    # конфиг ноды, менять не нужно
  export HF_HOME=/mnt/shared								    # Директория кеша, например `~/hf-cache`. Важно, чтобы там было больше 100Gb свободного диска (по умолчанию так и будет, если вы используете сервер с диском > 150Gb и путем `~/hf-cache`)
  ```

Загружаем обновленную конфигурацию
```bash
source config.env
```

### [На сервере] Редактируем "edit node-config.json"
Доступные модели: `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` (только для самых мощных GPU, например, 8xH100) и `Qwen/Qwen3-32B-FP8` (для остальных доступных GPU). Детали про доступные модели и их расширение [Transactions and Governance Guide](https://gonka.ai/transactions-and-governance/).

Редактируем "edit node-config.json" в соответствии с вашей конфигурацией по аналогии с примерами ниже:
1. Если у вас много мощных нод, например, 8xH200 или 8xH100:
```
[
    {
        "id": "node1",
        "host": "inference",
        "inference_port": 5000,
        "poc_port": 8080,
        "max_concurrent": 500,
        "models": {
            "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8": {
                "args": [
                    "--tensor-parallel-size","4"
                ]
            }
        }
    }
]
```

2. Если у вас 1 нода, например, H100 либо 2x4090:
```
[
    {
        "id": "node1",
        "host": "inference",
        "inference_port": 5000,
        "poc_port": 8080,
        "max_concurrent": 500,
        "models": {
            "Qwen/Qwen3-32B-FP8": {
                "args": []
            }
        }
    }
]
```

3. Если у вас много обычных нод, например, 8x4090:
```
[
    {
        "id": "node1",
        "host": "inference",
        "inference_port": 5000,
        "poc_port": 8080,
        "max_concurrent": 500,
        "models": {
            "Qwen/Qwen3-32B-FP8": {
                "args": [
                    "--tensor-parallel-size","4"
                ]
            }
        }
    }
]
```

Больше деталей [this link](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/).


### [На сервере] Скачиваем веса моделей Hugging Face
Нужно установить скачать веса моделей командами ниже.
1. Если у вас 8xH100 или 8xH200, то обе модели:

    ```bash
    mkdir -p $HF_HOME
    huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
    huggingface-cli download Qwen/Qwen3-32B-FP8
    ```

2. Иначе

    ```bash
    mkdir -p $HF_HOME
    huggingface-cli download Qwen/Qwen3-32B-FP8
    ```

Скорее всего у вас возникнет ошибка про отсутствие команды huggingface.

Тогда его нужно установить, и скачать веса модели командами как ниже:
```bash
pip install -U huggingface_hub
hf download Qwen/Qwen3-32B-FP8
```

Если команда hf не находится, попробуйте дозадать путь и повторить команду hf:
```bash
export PATH=$PATH:/home/user/.local/bin
```

Если не находится python / pip, установите его командами:
```bash
sudo apt-get update
sudo apt-get install python3-pip
```

Скачивание займет от минуты до часа и скаченные веса займут много места на диске.

## Запускаем ноды
### Установка nvidia-docker
Проверяем, что у вас установлен docker
```
docker --version
```
Если не установлен, инструкции по установке ниже, в "Как установить docker на сервер?"

NVIDIA Docker Container Toolkit скорее всего не установлен, его можно установить командами ниже
```
 # Добавить ключ репозитория
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -

# Определить дистрибутив
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)

# Добавить репозиторий
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

# Обновить пакеты
sudo apt-get update

# Установить nvidia-docker2
sudo apt-get install -y nvidia-docker2
```

Перезапустить docker если он был запущен:
```
sudo systemctl restart docker
```

Запустить docker если он не был запущен:
```
sudo systemctl start docker
```
или
```
sudo dockerd &
```


### [На сервере] Берем и запускаем Docker Images (Containers)

Проверьте, что вы в `gonka/deploy/join`.
Запустите:
```bash
sudo docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
```

Стартуйте сервисы:
```bash
sudo docker compose --env-file config.env up tmkms node -d --no-deps
```

Справка по сервисам:
- **`tmkms`** — генерирует и безопасно управляет ключом консенсуса, необходимым для регистрации валидатора.
- **`node`** — подключается к блокчейну и предоставляет конечную точку RPC для получения Consensus Key.
- **`api`** — намеренно исключен на этом этапе, на следующем этапе запустим его и создадим в нем ML Operational Key.


!!! Рекомендуется проверить успешность запуска через логи, чтобы их посмотреть:
    
```bash
docker compose --env-file config.env logs tmkms node -f
```

Если ошибок нет и последовательно появляются сообщения об обработке блоков, значит все ок. Чтобы вернуться из режима просмотра логов, жмите `Control+C`.

### Регистрация хоста и ключей
#### [На сервере] Создаем ML Operational Key и регистрируем Host

Запускаем  **`api`** сервис и заходим внутрь него:
```bash
sudo docker compose --env-file config.env run --rm --no-deps -it api /bin/sh
```

Внутри сервиса создаем ML operational key:
```bash
printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file
```
!!! Важно: не запускайте эту команду дважды. Если вдруг удалили его или запустили команду повторно, смотрите FAQ: “[I Deleted the Warm Key](https://gonka.ai/FAQ/#i-deleted-the-warm-key)”.

**Пример вывода:**
```
~ # printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file

- address: gonka1gyz2agg5yx49gy2z4qpsz9826t6s9xev6tkehw
  name: node-702105
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Ao8VPh5U5XQBcJ6qxAIwBbhF/3UPZEwzZ9H/qbIA6ipj"}'
  type: local

**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

again plastic athlete arrow first measure danger drastic wolf coyote work memory already inmate sorry path tackle custom write result west tray rabbit jeans
```

Сохраните вывод, адрес ML operational key (gonka1gyz2agg5yx49gy2z4qpsz9826t6s9xev6tkehw) вам скоро потребуется.

Регистрируем Host командой
```
inferenced register-new-participant \
    $DAPI_API__PUBLIC_URL \
    $ACCOUNT_PUBKEY \
    --node-address $DAPI_CHAIN_NODE__SEED_API_URL
```

**Пример вывода:**
```
...
Found participant with pubkey: Au+a3CpMj6nqFV6d0tUlVajCTkOP3cxKnps+1/lMv5zY (balance: 0)
Participant is now available at http://36.189.234.237:19250/v1/participants/gonka1rk52j24xj9ej87jas4zqpvjuhrgpnd7h3feqmm
```

После этого выходим из контейнера сервиса `api`:
```bash
exit
```


### [На локальной машине] Grant Permissions to ML Operational Key
**ВАЖНО: этот шаг выполняется на вашей локальной машине, где вы создавали Account Key**

Запустите команду для выдачи разрешений от вашего Account Key для ML Operational Key:
```bash
./inferenced tx inference grant-ml-ops-permissions \
    gonka-account-key \
    <адрес ML operational key, без кавычек (в нашем примере gonka1gyz2agg5yx49gy2z4qpsz9826t6s9xev6tkehw)> \
    --from gonka-account-key \
    --keyring-backend file \
    --gas 2000000 \
    --node <seed_api_url from server's config.env>/chain-rpc/ 
```

**Ожидаемый вывод:**
```
...
Transaction sent with hash: FB9BBBB5F8C155D0732B290C443A0D06BC114CDF43E8EE8FB329D646C608062E
Waiting for transaction to be included in a block...

Transaction confirmed successfully!
Block height: 1108166
```

### [На сервере] Запускаем ноды "майнинга" полностью
**ВАЖНО: этот шаг выполняется на сервере, из каталога gonka/deploy/join**

```bash
sudo docker compose --env-file config.env -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```

## Проверка и мониторинг
Примерно раз в день происходит окончание одной эпохи и начало новой - подробнее [тут](http://34.60.64.109/?page=timeline). В этот момент ваш аккаунт либо пройдет проверку и окажется в [списке Host-ов](http://34.60.64.109/) или [списке](http://node2.gonka.ai:8000/dashboard/gonka/validator), либо нет. Искать нужно по адресу вашего аккаунта, созданному вначале (в нашем примере gonka1rk52j24xj9ej87jas4zqpvjuhrgpnd7h3feqmm).

Если окажется, значит все в порядке, вы успешно подключились.
Если нет - надо искать ошибки по логам или в чатах [Discord](https://discord.com/invite/RADwCT2U6R). Также стоит пробовать еще раз на машинке с большим realibility или ресурсами, прежде всего VRAM.

После следуего конца эпохи вы должны увидеть начисленные "вестящиеся" GNK-токены по url-у http://gonka.spv.re:8000/dashboard/gonka/account/<адрес вашего аккаунта>, в нашем примере http://gonka.spv.re:8000/dashboard/gonka/account/gonka1rk52j24xj9ej87jas4zqpvjuhrgpnd7h3feqmm. Еще через эпоху появятся первые завестившиеся токены.

Подробнее про экономику https://gonka.ai/wallet/pricing/
Подробнее про балансы и переводы https://gonka.ai/wallet/wallet-and-transfer-guide

## Подключение кошелька [Keplr](https://www.keplr.app/) или [Leap](https://www.leapwallet.io/) для управления GNK
1. Установить расширение браузера по ссылке кошелька.
2. Вас перенаправят на страницу кошелька и начнут задавать вопросы. Выберите "Импортировать существующий кошелек" -> "по приватному ключу" -> вводите приватный ключ аккаунта, его можно получить командой, запущенной на локально из папки, в которой вы создавали аккаунт (см. начало инструкции).
```
./inferenced keys export gonka-account-key --keyring-backend file  --unarmored-hex --unsafe
```
3. По url-у http://gonka.spv.re:8000/dashboard/gonka/account/<адрес вашего аккаунта> жмете на правую верхнюю кнопку -> "подключить кошелек" -> выбираете кошелек.
4. Готово, теперь можете переводить токены GNK между аккаунтами.

## Остановка и очистка ваших нод
1. Отключите каждый MLNode.
```
curl -X POST http://<api_node_static_ip>:<admin_port>/admin/v1/nodes/<id>/disable
```
2. Дождитесь следующей эпохи. Пока не останавливайте узел. Флаг отключения вступит в силу только после начала следующей эпохи.
3. Проверьте удаление и вес. Проверьте и то, и другое для каждого отключённого узла:

- Он отсутствует в списке активных участников
- Его эффективный вес равен 0

4. Остановите MLNode.
5. Убедитесь, что вы находитесь в папке `gonka/deploy/join`. Чтобы остановить все запущенные контейнеры:
```bash
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml down
```
6. Это остановит и удалит все службы, определённые в файлах `docker-compose.yml` и `docker-compose.mlnode.yml`, без удаления томов или данных, если это не указано явно.

### Если вы хотите полностью сбросить узел и удалить все данные (для повторного развёртывания или миграции), выполните следующие действия по очистке.

1. Чтобы очистить кэш и начать заново, удалите локальные папки `.inference` и `.dapi` (кэш выполнения и идентификаторы вывода):
```bash
rm -rf .inference .dapi .tmkms
```

2. (Необязательно) Очистите кэш весов модели:
```bash
rm -rf $HF_HOME
```


## Частые вопросы и проблемы:
### Как выбрать нужный архив c `inferenced` под ваш компьютер или ноутбук?
#### 1. Как выбрать из списка
 - Если у вас Windows на Intel/AMD: берите inferenced-amd64.zip﻿ (универсальная x86_64 сборка; Windows не помечена отдельно в списке).​
 - Если у вас macOS на Intel: inferenced-darwin-amd64.zip﻿.​
 - Если у вас macOS на Apple Silicon (M1/M2/M3): inferenced-darwin-arm64.zip﻿.​
 - Если у вас Linux на Intel/AMD: inferenced-linux-amd64.zip﻿.​
 - Если у вас Linux на ARM (ARM сервер, Raspberry Pi 64‑бит): inferenced-linux-arm64.zip﻿.​
 - decentralized-api-amd64.zip﻿ — более крупный пакет для amd64; выбирайте его, если нужна именно сборка с компонентом decentralized‑api для x86_64 систем.​
 - Если нужен исходный код и самостоятельная сборка — используйте архивы Source code (zip/tar.gz).

#### 2. Как узнать свою архитектуру
 - macOS: Яблоко → Об этом Mac (процессор Intel или Apple M‑серии) — Intel = amd64, Apple Silicon = arm64.​
 - Linux: Команда uname -m﻿ вернёт x86_64﻿ (amd64) или aarch64﻿ (arm64).​
 - Windows: Параметры → Система → О системе; «тип системы» укажет 64‑разрядную ОС на x64 (amd64) или ARM64.​

### Как редактировать файлы на сервере?
Команда
```
nano <имя файла, например, config.env>
```
Чтобы закончить редактирование (и сохранить) смотри инструкции внизу открывшегося режима редактирования.

Если команда `nano` не находится
```
sudo apt install nano
```

### Как установить docker на сервер?
Командой
```
sudo snap install docker
```

Успешность установки можно проверить командой
```
docker --version
```

Если не сработате, можно попробовать:
```
apt update
apt install apt-transport-https ca-certificates curl software-properties-common -y

apt update
apt install gnupg2 gpg-agent software-properties-common -y

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install docker-ce docker-ce-cli containerd.io -y
```

### Куда обращаться в случае проблем?
[Discord](https://discord.com/invite/RADwCT2U6R), там есть дружелюбное комьюнити на русском языке.
