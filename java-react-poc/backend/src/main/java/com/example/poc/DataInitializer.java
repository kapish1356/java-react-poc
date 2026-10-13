package com.example.poc;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedEmployees(EmployeeRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Employee("Aarav Sharma", "aarav.sharma@example.com", "Engineering", "Frontend Developer"));
                repository.save(new Employee("Priya Verma", "priya.verma@example.com", "Design", "Product Designer"));
                repository.save(new Employee("Rohan Gupta", "rohan.gupta@example.com", "Operations", "Team Lead"));
            }
        };
    }
}
