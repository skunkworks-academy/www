# 🛠️ Asterisk + ARI — Skunkworks Academy Edition

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/skunkworks-academy/asterisk?style=social)](https://github.com/skunkworks-academy/asterisk/stargazers)
[![Watchers](https://img.shields.io/github/watchers/skunkworks-academy/asterisk?style=social)](https://github.com/skunkworks-academy/asterisk/watchers)
[![Forks](https://img.shields.io/github/forks/skunkworks-academy/asterisk?style=social)](https://github.com/skunkworks-academy/asterisk/network/members)

> A fully containerized **Asterisk** server with **ARI (Asterisk REST Interface)** enabled — designed for rapid prototyping, training, and scalable VoIP application development.

---

## 📽️ Demo Preview

![Asterisk ARI in Action](https://upload.wikimedia.org/wikipedia/commons/4/4f/Voip-diagram.gif)
> *Example of SIP and VoIP signaling, representative of ARI flow control.*

---

## 🚀 Key Features

- 🎧 Asterisk 18+ preconfigured with [ARI](https://wiki.asterisk.org/wiki/display/AST/Asterisk+13+ARI+Guide)
- 🔐 Secure RESTful API access to manage calls and channels
- 🧱 Modular for SIP, WebRTC, and PSTN gateway extensions
- 📦 Lightweight setup for Docker and bare metal
- 📚 Ideal for labs, training, and custom telecom applications

---

## 📦 Installation

```bash
git clone https://github.com/skunkworks-academy/asterisk.git
cd asterisk
docker-compose up -d
```
| Default ARI is exposed at: http://localhost:8088/ari

## 🔐 Authentication
Update ari.conf:

``` ini
Copy
Edit
[skunkuser]
type = user
read_only = no
password = strongpassword
```

Access via:

``` bash
Copy
Edit
curl -u skunkuser:strongpassword http://localhost:8088/ari/channels
```

## 🧰 API Usage Examples
- 📞 List active channels:

``` bash
Copy
Edit
curl -u skunkuser:strongpassword http://localhost:8088/ari/channels
```

- ➕ Originate a new call:

``` bash
Copy
Edit
curl -u skunkuser:strongpassword \
  -X POST "http://localhost:8088/ari/channels?endpoint=SIP/1000&extension=2000&context=default&priority=1"
```

## 🗺️ Architecture
``` plaintext
Copy
Edit
[ Client App ] <---> [ ARI REST API ] <---> [ Asterisk Core ] <---> [ SIP/WebRTC ]
```
- ARI enables real-time control of calls, bridges, and applications
- Integrate with Node.js, Python (e.g. asterisk-ari), or Go

## 🧪 Learning Outcomes
This repository aligns with Revised Bloom’s Taxonomy for VoIP learning:

Cognitive Level	Objective
Remembering	Describe Asterisk and ARI architecture
Understanding	Interpret JSON output from ARI endpoints
Applying	Launch SIP calls via ARI
Analyzing	Monitor and debug channel flows
Evaluating	Compare ARI vs. AGI control
Creating	Build a custom call routing application

## 🧭 Resources
- 📘 Asterisk ARI Documentation
- 🔧 Asterisk Official Site
- 🧪 VoIP Training – Skunkworks Africa

## 📝 License
This project is licensed under the MIT License — see the LICENSE file for details.

Crafted by Skunkworks Academy — empowering Africa's next-gen telecom engineers. 🚀
