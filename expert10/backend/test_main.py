import os
os.environ.pop("EXPERT10_API_TOKEN",None)
from fastapi.testclient import TestClient
from main import app

client=TestClient(app)
def test_health():
    r=client.get("/health")
    assert r.status_code==200
    assert "provider_configured" in r.json()

def test_requires_auth():
    r=client.post("/api/v1/reconstruct",files={"image":("chair.png",b"test","image/png")},data={"format":"glb"})
    assert r.status_code==401

def test_reject_skp(monkeypatch):
    monkeypatch.setenv("EXPERT10_API_TOKEN","test-secret")
    r=client.post("/api/v1/reconstruct",headers={"Authorization":"Bearer test-secret"},files={"image":("chair.png",b"test","image/png")},data={"format":"skp"})
    assert r.status_code==422

def test_reject_invalid_mime(monkeypatch):
    monkeypatch.setenv("EXPERT10_API_TOKEN","test-secret")
    r=client.post("/api/v1/reconstruct",headers={"Authorization":"Bearer test-secret"},files={"image":("bad.txt",b"test","text/plain")},data={"format":"glb"})
    assert r.status_code==415

def test_reject_large_file(monkeypatch):
    monkeypatch.setenv("EXPERT10_API_TOKEN","test-secret")
    r=client.post("/api/v1/reconstruct",headers={"Authorization":"Bearer test-secret"},files={"image":("bad.png",b"x"*(10*1024*1024+1),"image/png")},data={"format":"glb"})
    assert r.status_code==413
