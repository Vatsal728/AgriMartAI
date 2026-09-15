"""
Persistent SQLite Database for AgriSmart AI
Complete Figma-Driven Architecture:
- 1. User Authentication, OTP & Profiles (David Miller, English/Hindi language selection)
- 2. Farm Setup, GPS Location & Field Plots
- 3. Multimodal Leaf Diagnoses & 3-Accordion Treatment Plans
- 4. Multi-Turn Chat Sessions & Message History (WAL Mode)
- 5. Bookmarked / Saved Answers
- 6. Sustainability Score & Eco-Improvement Goals
- 7. AgriMart Marketplace Catalog & Recommended Products
"""

import os
import sqlite3
import json
import uuid
import hashlib
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

DB_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
DB_PATH = os.path.join(DB_DIR, "agrimart_sessions.db")

os.makedirs(DB_DIR, exist_ok=True)

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def init_db():
    conn = get_db_connection()
    with conn:
        conn.executescript("""
        -- 1. Users Table
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            phone_number TEXT UNIQUE,
            email TEXT UNIQUE,
            password_hash TEXT,
            full_name TEXT NOT NULL,
            avatar_url TEXT,
            preferred_language TEXT DEFAULT 'en',
            subscription_plan TEXT DEFAULT 'Free',
            is_verified BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- 2. OTP Verification
        CREATE TABLE IF NOT EXISTS auth_otps (
            id TEXT PRIMARY KEY,
            phone_number TEXT NOT NULL,
            otp_code TEXT NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            is_used BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- 3. Farms Table
        CREATE TABLE IF NOT EXISTS farms (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            farm_name TEXT NOT NULL,
            location_name TEXT NOT NULL,
            latitude REAL DEFAULT 0.0,
            longitude REAL DEFAULT 0.0,
            total_area REAL DEFAULT 1.0,
            area_unit TEXT DEFAULT 'Acres',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
        );

        -- 4. Fields (Plots / Crop Batches)
        CREATE TABLE IF NOT EXISTS fields (
            id TEXT PRIMARY KEY,
            farm_id TEXT NOT NULL,
            plot_name TEXT NOT NULL,
            crop_name TEXT NOT NULL,
            crop_variety TEXT,
            soil_type TEXT DEFAULT 'Loamy',
            sowing_date DATE,
            area REAL DEFAULT 1.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(farm_id) REFERENCES farms(id) ON DELETE CASCADE
        );

        -- 5. Leaf Diagnoses
        CREATE TABLE IF NOT EXISTS diagnoses (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            field_id TEXT,
            image_url TEXT NOT NULL,
            crop TEXT NOT NULL,
            disease_name TEXT NOT NULL,
            scientific_name TEXT,
            confidence REAL NOT NULL,
            severity TEXT DEFAULT 'Mild',
            model_used TEXT DEFAULT 'EfficientNet-B0',
            scan_date DATE DEFAULT CURRENT_DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
            FOREIGN KEY(field_id) REFERENCES fields(id) ON DELETE SET NULL
        );

        -- 6. Treatment Plans (3-Part Figma Accordions)
        CREATE TABLE IF NOT EXISTS treatment_plans (
            id TEXT PRIMARY KEY,
            diagnosis_id TEXT UNIQUE NOT NULL,
            precautions_immediate TEXT NOT NULL,
            recommended_treatment TEXT NOT NULL,
            long_term_prevention TEXT NOT NULL,
            weather_risk_notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(diagnosis_id) REFERENCES diagnoses(id) ON DELETE CASCADE
        );

        -- 7. Chat Sessions
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            field_id TEXT,
            title TEXT NOT NULL,
            crop TEXT DEFAULT 'General',
            location TEXT DEFAULT 'Ahmedabad, Gujarat',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
            FOREIGN KEY(field_id) REFERENCES fields(id) ON DELETE SET NULL
        );

        -- 8. Messages
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
            content TEXT NOT NULL,
            image_path TEXT,
            diagnosis_json TEXT,
            source TEXT DEFAULT 'AgriSmart AI',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(session_id) REFERENCES sessions(id) ON DELETE CASCADE
        );

        -- 9. Saved Answers / Bookmarks
        CREATE TABLE IF NOT EXISTS saved_answers (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            title TEXT NOT NULL,
            summary_text TEXT NOT NULL,
            category TEXT DEFAULT 'Agronomy',
            source_message_id TEXT,
            is_bookmarked BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(source_message_id) REFERENCES messages(id) ON DELETE SET NULL
        );

        -- 10. Sustainability Scores & Improvement Goals
        CREATE TABLE IF NOT EXISTS sustainability_scores (
            id TEXT PRIMARY KEY,
            farm_id TEXT UNIQUE NOT NULL,
            current_score INTEGER DEFAULT 82,
            target_score INTEGER DEFAULT 90,
            water_efficiency_score INTEGER DEFAULT 85,
            carbon_reduction_score INTEGER DEFAULT 78,
            chemical_reduction_score INTEGER DEFAULT 83,
            calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(farm_id) REFERENCES farms(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS improvement_actions (
            id TEXT PRIMARY KEY,
            score_id TEXT NOT NULL,
            action_title TEXT NOT NULL,
            description TEXT,
            points_reward INTEGER DEFAULT 5,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(score_id) REFERENCES sustainability_scores(id) ON DELETE CASCADE
        );

        -- 11. Products (AgriMart Recommended Marketplace)
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            active_ingredient TEXT,
            price_inr REAL NOT NULL,
            package_size TEXT NOT NULL,
            image_url TEXT,
            target_diseases TEXT,
            stock_quantity INTEGER DEFAULT 100,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Performance Indexes
        CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
        CREATE INDEX IF NOT EXISTS idx_sessions_updated ON sessions(updated_at DESC);
        CREATE INDEX IF NOT EXISTS idx_diagnoses_user ON diagnoses(user_id);
        CREATE INDEX IF NOT EXISTS idx_saved_answers_user ON saved_answers(user_id);
        """)
        
        # Safe migrations for legacy database files
        for col_def in ["user_id TEXT", "field_id TEXT"]:
            try:
                conn.execute(f"ALTER TABLE sessions ADD COLUMN {col_def};")
            except Exception:
                pass
    conn.close()

# Initialize tables immediately upon import
init_db()

# Pre-seed initial default data if table is empty
def seed_default_data():
    conn = get_db_connection()
    try:
        # Check if default user exists
        user_row = conn.execute("SELECT id FROM users WHERE id = 'usr_david_miller'").fetchone()
        if not user_row:
            with conn:
                # 1. Default User (David Miller from Figma UI)
                conn.execute("""
                INSERT OR IGNORE INTO users (id, phone_number, email, password_hash, full_name, avatar_url, preferred_language, subscription_plan, is_verified)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
                """, (
                    "usr_david_miller",
                    "+919876543210",
                    "farmer@agri.com",
                    hash_password("farm1234"),
                    "David Miller",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop",
                    "en",
                    "Premium Plan"
                ))

                # 2. Default Farm (Central Valley - Sector 7)
                conn.execute("""
                INSERT OR IGNORE INTO farms (id, user_id, farm_name, location_name, latitude, longitude, total_area, area_unit)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    "farm_central_valley",
                    "usr_david_miller",
                    "Central Valley - Sector 7",
                    "Central Valley, CA, USA",
                    36.7783,
                    -119.4179,
                    120.0,
                    "Acres"
                ))

                # 3. Default Fields (Plots)
                conn.execute("""
                INSERT OR IGNORE INTO fields (id, farm_id, plot_name, crop_name, crop_variety, soil_type, sowing_date, area)
                VALUES 
                ('fld_plot_b12', 'farm_central_valley', 'Plot B-12 (North)', 'Tomato', 'Tomato (Hybrid)', 'Loamy', '2026-08-01', 45.0),
                ('fld_plot_a04', 'farm_central_valley', 'Plot A-04 (East)', 'Cotton', 'Bt Cotton RCH-659', 'Black Clay', '2026-07-15', 75.0)
                """)

                # 4. Default Sustainability Score & Improvement Goals
                conn.execute("""
                INSERT OR IGNORE INTO sustainability_scores (id, farm_id, current_score, target_score, water_efficiency_score, carbon_reduction_score, chemical_reduction_score)
                VALUES ('score_cv_01', 'farm_central_valley', 82, 90, 88, 76, 82)
                """)

                conn.execute("""
                INSERT OR IGNORE INTO improvement_actions (id, score_id, action_title, description, points_reward, status)
                VALUES 
                ('act_01', 'score_cv_01', 'Drip Irrigation Upgrade', 'Reduce water waste by 15% in Sector 7 North', 8, 'in_progress'),
                ('act_02', 'score_cv_01', 'Solar Pump Transition', 'Switch Sector 4 pumps to 100% renewable solar power', 5, 'pending'),
                ('act_03', 'score_cv_01', 'Bio-Fungicide Adoption', 'Integrate Trichoderma viride seed treatment', 5, 'completed')
                """)

                # 5. Default Marketplace Products
                conn.execute("""
                INSERT OR IGNORE INTO products (id, name, category, active_ingredient, price_inr, package_size, image_url, target_diseases, stock_quantity)
                VALUES 
                ('prod_01', 'Dithane M-45 (Mancozeb 75% WP)', 'Fungicide', 'Mancozeb 75% WP', 450.0, '500 g', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300', '["Early Blight", "Late Blight", "Leaf Spot", "Apple Scab"]', 150),
                ('prod_02', 'Neemazal 10000 PPM Bio-Pesticide', 'Bio-Insecticide', 'Azadirachtin 1%', 680.0, '1 Liter', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300', '["Whitefly", "Aphids", "Spider Mites", "Armyworm"]', 85),
                ('prod_03', 'Streptocycline Bactericide', 'Bactericide', 'Streptomycin + Tetracycline', 120.0, '6 g pouch', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300', '["Bacterial Wilt", "Bacterial Spot", "Black Rot"]', 240),
                ('prod_04', 'Water Soluble NPK 19:19:19 Fertigation', 'Fertilizer', 'N:P:K (19:19:19)', 380.0, '1 kg', 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=300', '["Nutrient Deficiency", "Growth Stunting"]', 300)
                """)

                # 6. Default Saved Answers / Bookmarks
                conn.execute("""
                INSERT OR IGNORE INTO saved_answers (id, user_id, title, summary_text, category)
                VALUES 
                ('ans_01', 'usr_david_miller', 'Soil pH Correction for North Orchard', 'The current pH is slightly acidic at 5.8. Apply 2 tons of calcitic limestone per acre this fall to bring it closer to 6.5.', 'Soil Nutrition'),
                ('ans_02', 'usr_david_miller', 'Tomato Early Blight 3-Stage Treatment', 'Spray Mancozeb 75% WP @ 2.5g/L water. Prune bottom 30cm leaves to break spore splash cycle.', 'Disease Control'),
                ('ans_03', 'usr_david_miller', 'Fall Armyworm IPM Biological Threshold', 'Deploy 5 pheromone traps/acre. Spray Bacillus thuringiensis (Bt) kurstaki @ 1.5 kg/ha at egg hatch stage.', 'Pest Management')
                """)
    except Exception as e:
        print(f"[Seed Notice]: {e}")
    finally:
        conn.close()

seed_default_data()

# ==============================================================================
# Database Managers
# ==============================================================================

class UserDB:
    @staticmethod
    def register(full_name: str, phone_number: Optional[str] = None, email: Optional[str] = None, password: Optional[str] = None, language: str = 'en') -> Dict[str, Any]:
        user_id = f"usr_{uuid.uuid4().hex[:10]}"
        now = datetime.now().isoformat()
        pwd_hash = hash_password(password) if password else None
        
        conn = get_db_connection()
        with conn:
            conn.execute(
                """
                INSERT INTO users (id, phone_number, email, password_hash, full_name, preferred_language, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (user_id, phone_number, email, pwd_hash, full_name, language, now, now)
            )
        conn.close()
        return UserDB.get_user(user_id)

    @staticmethod
    def authenticate(login_id: str, password: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        pwd_hash = hash_password(password)
        row = conn.execute(
            "SELECT * FROM users WHERE (phone_number = ? OR email = ?) AND password_hash = ?",
            (login_id, login_id, pwd_hash)
        ).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def create_otp(phone_number: str) -> str:
        otp_id = f"otp_{uuid.uuid4().hex[:8]}"
        otp_code = "123456" # Default test OTP for development / SMS gateway integration
        expires_at = (datetime.now() + timedelta(minutes=10)).isoformat()
        
        conn = get_db_connection()
        with conn:
            conn.execute(
                "INSERT INTO auth_otps (id, phone_number, otp_code, expires_at) VALUES (?, ?, ?, ?)",
                (otp_id, phone_number, otp_code, expires_at)
            )
        conn.close()
        return otp_code

    @staticmethod
    def verify_otp(phone_number: str, otp_code: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        now = datetime.now().isoformat()
        row = conn.execute(
            "SELECT * FROM auth_otps WHERE phone_number = ? AND otp_code = ? AND is_used = 0 AND expires_at > ? ORDER BY created_at DESC LIMIT 1",
            (phone_number, otp_code, now)
        ).fetchone()
        
        if row:
            with conn:
                conn.execute("UPDATE auth_otps SET is_used = 1 WHERE id = ?", (row["id"],))
            user_row = conn.execute("SELECT * FROM users WHERE phone_number = ?", (phone_number,)).fetchone()
            conn.close()
            if user_row:
                return dict(user_row)
            # Auto-register if new phone
            return UserDB.register(full_name=f"Farmer ({phone_number[-4:]})", phone_number=phone_number)
        conn.close()
        return None

    @staticmethod
    def get_user(user_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        row = conn.execute("SELECT id, phone_number, email, full_name, avatar_url, preferred_language, subscription_plan, is_verified, created_at FROM users WHERE id = ?", (user_id,)).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def update_language(user_id: str, language: str) -> bool:
        conn = get_db_connection()
        with conn:
            conn.execute("UPDATE users SET preferred_language = ?, updated_at = ? WHERE id = ?", (language, datetime.now().isoformat(), user_id))
        conn.close()
        return True


class FarmDB:
    @staticmethod
    def create_farm(user_id: str, farm_name: str, location_name: str, latitude: float = 0.0, longitude: float = 0.0, total_area: float = 1.0, area_unit: str = "Acres") -> Dict[str, Any]:
        farm_id = f"farm_{uuid.uuid4().hex[:10]}"
        now = datetime.now().isoformat()
        conn = get_db_connection()
        with conn:
            conn.execute(
                "INSERT INTO farms (id, user_id, farm_name, location_name, latitude, longitude, total_area, area_unit, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (farm_id, user_id, farm_name, location_name, latitude, longitude, total_area, area_unit, now, now)
            )
            # Create default sustainability score container
            score_id = f"score_{uuid.uuid4().hex[:8]}"
            conn.execute(
                "INSERT INTO sustainability_scores (id, farm_id, current_score, target_score) VALUES (?, ?, 80, 90)",
                (score_id, farm_id)
            )
        conn.close()
        return FarmDB.get_farm(farm_id)

    @staticmethod
    def get_farm(farm_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        row = conn.execute("SELECT * FROM farms WHERE id = ?", (farm_id,)).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def get_user_farms(user_id: str) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM farms WHERE user_id = ? ORDER BY created_at DESC", (user_id,)).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def create_field(farm_id: str, plot_name: str, crop_name: str, soil_type: str = "Loamy", area: float = 1.0, sowing_date: Optional[str] = None) -> Dict[str, Any]:
        field_id = f"fld_{uuid.uuid4().hex[:10]}"
        now = datetime.now().isoformat()
        conn = get_db_connection()
        with conn:
            conn.execute(
                "INSERT INTO fields (id, farm_id, plot_name, crop_name, soil_type, sowing_date, area, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (field_id, farm_id, plot_name, crop_name, soil_type, sowing_date, area, now, now)
            )
        conn.close()
        return {"id": field_id, "farm_id": farm_id, "plot_name": plot_name, "crop_name": crop_name, "soil_type": soil_type, "area": area}

    @staticmethod
    def get_fields(farm_id: str) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM fields WHERE farm_id = ? ORDER BY created_at ASC", (farm_id,)).fetchall()
        conn.close()
        return [dict(r) for r in rows]


class DiagnosisDB:
    @staticmethod
    def save_diagnosis(
        user_id: Optional[str],
        crop: str,
        disease_name: str,
        scientific_name: str,
        confidence: float,
        image_url: str,
        precautions: str,
        treatment: str,
        prevention: str,
        severity: str = "Mild",
        model_used: str = "EfficientNet-B0",
        field_id: Optional[str] = None,
        weather_risk_notes: Optional[str] = None
    ) -> Dict[str, Any]:
        diag_id = f"diag_{uuid.uuid4().hex[:10]}"
        plan_id = f"plan_{uuid.uuid4().hex[:10]}"
        now = datetime.now().isoformat()
        
        conn = get_db_connection()
        with conn:
            conn.execute(
                """
                INSERT INTO diagnoses (id, user_id, field_id, image_url, crop, disease_name, scientific_name, confidence, severity, model_used, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (diag_id, user_id, field_id, image_url, crop, disease_name, scientific_name, confidence, severity, model_used, now)
            )
            conn.execute(
                """
                INSERT INTO treatment_plans (id, diagnosis_id, precautions_immediate, recommended_treatment, long_term_prevention, weather_risk_notes)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (plan_id, diag_id, precautions, treatment, prevention, weather_risk_notes)
            )
        conn.close()
        return DiagnosisDB.get_diagnosis(diag_id)

    @staticmethod
    def get_diagnosis(diag_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        row = conn.execute(
            """
            SELECT d.*, t.precautions_immediate, t.recommended_treatment, t.long_term_prevention, t.weather_risk_notes
            FROM diagnoses d
            LEFT JOIN treatment_plans t ON d.id = t.diagnosis_id
            WHERE d.id = ?
            """,
            (diag_id,)
        ).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def get_recent_diagnoses(user_id: Optional[str] = None, limit: int = 6) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        query = "SELECT * FROM diagnoses"
        params = []
        if user_id:
            query += " WHERE user_id = ?"
            params.append(user_id)
        query += " ORDER BY created_at DESC LIMIT ?"
        params.append(limit)
        
        rows = conn.execute(query, params).fetchall()
        conn.close()
        return [dict(r) for r in rows]


class SavedAnswersDB:
    @staticmethod
    def save_answer(title: str, summary_text: str, category: str = "Agronomy", user_id: str = "usr_david_miller") -> Dict[str, Any]:
        ans_id = f"ans_{uuid.uuid4().hex[:10]}"
        conn = get_db_connection()
        with conn:
            conn.execute(
                "INSERT INTO saved_answers (id, user_id, title, summary_text, category) VALUES (?, ?, ?, ?, ?)",
                (ans_id, user_id, title, summary_text, category)
            )
        conn.close()
        return {"id": ans_id, "title": title, "summary_text": summary_text, "category": category}

    @staticmethod
    def get_all(user_id: Optional[str] = "usr_david_miller") -> List[Dict[str, Any]]:
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM saved_answers WHERE user_id = ? ORDER BY created_at DESC", (user_id,)).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def delete(ans_id: str) -> bool:
        conn = get_db_connection()
        with conn:
            conn.execute("DELETE FROM saved_answers WHERE id = ?", (ans_id,))
        conn.close()
        return True


class SustainabilityDB:
    @staticmethod
    def get_score_and_actions(farm_id: str = "farm_central_valley") -> Dict[str, Any]:
        conn = get_db_connection()
        score_row = conn.execute("SELECT * FROM sustainability_scores WHERE farm_id = ?", (farm_id,)).fetchone()
        if not score_row:
            conn.close()
            return {"score": 82, "target": 90, "actions": []}
            
        score_data = dict(score_row)
        action_rows = conn.execute("SELECT * FROM improvement_actions WHERE score_id = ? ORDER BY points_reward DESC", (score_data["id"],)).fetchall()
        conn.close()
        return {
            "score": score_data,
            "actions": [dict(a) for a in action_rows]
        }

    @staticmethod
    def toggle_action(action_id: str, new_status: str) -> bool:
        conn = get_db_connection()
        with conn:
            conn.execute("UPDATE improvement_actions SET status = ? WHERE id = ?", (new_status, action_id))
        conn.close()
        return True


class ProductDB:
    @staticmethod
    def get_all_products(category: Optional[str] = None) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        query = "SELECT * FROM products"
        params = []
        if category:
            query += " WHERE category = ?"
            params.append(category)
        query += " ORDER BY price_inr ASC"
        rows = conn.execute(query, params).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def get_recommendations_for_disease(disease_name: str) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM products WHERE target_diseases LIKE ? LIMIT 4", (f"%{disease_name}%",)).fetchall()
        conn.close()
        if not rows:
            # Fallback to general fungicides/bio-pesticides
            conn = get_db_connection()
            rows = conn.execute("SELECT * FROM products LIMIT 3").fetchall()
            conn.close()
        return [dict(r) for r in rows]


# ==============================================================================
# Existing ChatDatabase API Preservation (100% Backwards Compatible)
# ==============================================================================

class ChatDatabase:
    @staticmethod
    def create_session(title: Optional[str] = None, crop: str = "General", location: str = "Ahmedabad, Gujarat", user_id: str = "usr_david_miller") -> Dict[str, Any]:
        session_id = f"ses_{uuid.uuid4().hex[:10]}"
        now = datetime.now().isoformat()
        session_title = title or f"New Farm Consultation ({datetime.now().strftime('%b %d, %H:%M')})"
        
        conn = get_db_connection()
        with conn:
            conn.execute(
                "INSERT INTO sessions (id, user_id, title, crop, location, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (session_id, user_id, session_title, crop, location, now, now)
            )
        conn.close()
        
        return {
            "id": session_id,
            "title": session_title,
            "crop": crop,
            "location": location,
            "created_at": now,
            "updated_at": now
        }

    @staticmethod
    def get_all_sessions(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        query = """
            SELECT s.id, s.title, s.crop, s.location, s.created_at, s.updated_at,
                   COUNT(m.id) as message_count,
                   (SELECT content FROM messages WHERE session_id = s.id ORDER BY created_at DESC LIMIT 1) as last_message
            FROM sessions s
            LEFT JOIN messages m ON s.id = m.session_id
        """
        params = []
        if user_id:
            query += " WHERE s.user_id = ?"
            params.append(user_id)
        query += " GROUP BY s.id ORDER BY s.updated_at DESC"
        
        rows = conn.execute(query, params).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def get_session(session_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def update_session(session_id: str, title: Optional[str] = None, crop: Optional[str] = None, location: Optional[str] = None) -> bool:
        conn = get_db_connection()
        now = datetime.now().isoformat()
        updates = ["updated_at = ?"]
        params = [now]

        if title:
            updates.append("title = ?")
            params.append(title)
        if crop and crop != "General":
            updates.append("crop = ?")
            params.append(crop)
        if location:
            updates.append("location = ?")
            params.append(location)

        params.append(session_id)
        with conn:
            conn.execute(f"UPDATE sessions SET {', '.join(updates)} WHERE id = ?", params)
        conn.close()
        return True

    @staticmethod
    def delete_session(session_id: str) -> bool:
        conn = get_db_connection()
        with conn:
            conn.execute("DELETE FROM sessions WHERE id = ?", (session_id,))
        conn.close()
        return True

    @staticmethod
    def add_message(
        session_id: str, 
        role: str, 
        content: str, 
        image_path: Optional[str] = None, 
        diagnosis_data: Optional[Dict[str, Any]] = None,
        source: Optional[str] = "AgriSmart AI"
    ) -> Dict[str, Any]:
        msg_id = f"msg_{uuid.uuid4().hex[:10]}"
        now = datetime.now().isoformat()
        diag_json_str = json.dumps(diagnosis_data) if diagnosis_data else None

        conn = get_db_connection()
        with conn:
            conn.execute(
                """
                INSERT INTO messages (id, session_id, role, content, image_path, diagnosis_json, source, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (msg_id, session_id, role, content, image_path, diag_json_str, source, now)
            )
            conn.execute("UPDATE sessions SET updated_at = ? WHERE id = ?", (now, session_id))
        conn.close()

        return {
            "id": msg_id,
            "session_id": session_id,
            "role": role,
            "content": content,
            "image_path": image_path,
            "diagnosis": diagnosis_data,
            "source": source,
            "created_at": now
        }

    @staticmethod
    def get_messages(session_id: str) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        rows = conn.execute(
            "SELECT id, session_id, role, content, image_path, diagnosis_json, source, created_at FROM messages WHERE session_id = ? ORDER BY created_at ASC",
            (session_id,)
        ).fetchall()
        conn.close()

        results = []
        for r in rows:
            d = dict(r)
            d["diagnosis"] = json.loads(d["diagnosis_json"]) if d["diagnosis_json"] else None
            del d["diagnosis_json"]
            results.append(d)
        return results
