(main branch)

No fluff. No over‑explaining. Just the essentials.

---

# **Self‑Paced Program — README**

## **Overview**
This folder documents how Skunkworks Academy Self‑Paced Courses are organized and published.  
It supports instructors, maintainers, and anyone adding or updating self‑paced content.

---

## **Purpose**
- Central place for self‑paced course documentation  
- Defines how courses are listed on the landing page  
- Stores metadata, assets, and templates used across the program  

---

## **Repository**
Main GitHub repo for this documentation:

👉 **`https://github.com/skunkworks-academy/.github` [(github.com in Bing)](https://www.bing.com/search?q="https%3A%2F%2Fgithub.com%2Fskunkworks-academy%2F.github")**

Self‑paced directory:

```
.github/
   self-paced/
      README.md
```

---

## **Add a New Course**
1. Create a metadata file (JSON/YAML) in `metadata/`  
2. Include:
   - Title  
   - Course code  
   - Description  
   - Outcomes  
   - Enrollment link  
3. Add any images to `assets/`  
4. Commit to `main` — landing page updates automatically  

---

## **For Instructors**
Each course must include:
- Course overview  
- Module list  
- Assessments (if applicable)  
- Enrollment instructions  

Naming format:

```
COURSECODE-course-name
Example: DPG-610A-datapower-gateway
```

---

## **For Maintainers**
- Landing page is generated from metadata  
- GitHub Pages deploys automatically on push to `main`  
- Templates live in `templates/`  

---

## **Learners**
To enroll in a self‑paced course, visit:

👉 **[Self‑Paced Course Portal](#)**  
*(Replace with your actual link)*

---

## **Support**
- Technical: support@skunkworks.academy  
- Training: training@skunkworks.academy  

---

If you want, I can also generate:
- a **metadata schema example**,  
- a **course card template**,  
- or a **minimal landing page HTML** to match this README.
