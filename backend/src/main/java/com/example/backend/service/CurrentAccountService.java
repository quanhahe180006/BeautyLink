package com.example.backend.service;
import com.example.backend.exception.ApiException;
import com.example.backend.model.UserAccount;
import com.example.backend.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
@Service
public class CurrentAccountService {
    private final UserAccountRepository users;
    public CurrentAccountService(UserAccountRepository users) { this.users = users; }
    public UserAccount require(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Vui lòng đăng nhập");
        return users.findByPhone(auth.getName()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "ACCOUNT_NOT_FOUND", "Tài khoản không tồn tại"));
    }
}
