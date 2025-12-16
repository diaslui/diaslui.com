<img style="display:block; margin:auto;" src="https://diaslui.com/assets/img/full-diaslui.png" alt="diaslui.com logo" width="50"/>

# diaslui.com


This repository contains the full service for <a href="https://diaslui.com">diaslui.com</a>.

---

## Tech Review

* **Runtime**: Bun
* **Framework**: Elysia
* **Templating**: EJS
* **ORM**: Prisma
* **Database**: PostgreSQL
* **Reverse Proxy**: Nginx
* **Containerization**: Docker / Docker Compose
* **Deployment**: Fly.io

---

## Running?

### Environment Variables

Some environment variables

Required:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

Opcional:

```env
LASTFM_API_KEY =yourapikey
STATER_USER_EMAIL=youremail
STATER_USER_PASSWORD=yourpassword
STATER_USER_USERNAME=yourusername
STATER_USER_DISPLAY_NAME=yourdisplayname
```

### Build and Run

```bash
docker compose up --build
```

Services started:

* **webapp** → Bun + Elysia (`:3000`)
* **db** → PostgreSQL (`:5432`)
* **nginx** → Reverse proxy (`:80`)

The backend listens on:

```
0.0.0.0:3000
```
Click here to open in your browser: [http://localhost](http://localhost)

<img style="display:block; margin:auto;" src="https://diaslui.com/assets/img/ogbanner.jpg" alt="diaslui.com logo"/>

