package com.example.backend.auth;

import com.example.backend.model.UserAccount;
import com.example.backend.repository.UserAccountRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class AccountDetailsService implements UserDetailsService {
    private final UserAccountRepository users;
    public AccountDetailsService(UserAccountRepository users) { this.users = users; }
    @Override public UserDetails loadUserByUsername(String phone) {
        UserAccount user = users.findByPhone(phone).orElseThrow(() -> new UsernameNotFoundException("Account not found"));
        return User.withUsername(user.getPhone()).password(user.getPasswordHash())
                .authorities("ROLE_" + user.getRole().name())
                .disabled(user.getStatus() != com.example.backend.model.DomainEnums.AccountStatus.ACTIVE).build();
    }
}
